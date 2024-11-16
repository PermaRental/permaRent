"use strict";

// #############
// Example: Basic usage
// - see "Basic usage" section in README for an explanation
// #############
import dotenv from 'dotenv';
dotenv.config();
import { NFC } from 'nfc-pcsc';
import { IndexService, decodeOnChainData, DataLocationOnChain } from '@ethsign/sp-sdk';
// utils/lit.ts
import {
	LitAbility,
	LitAccessControlConditionResource,
	createSiweMessageWithRecaps,
	generateAuthSig,
} from '@lit-protocol/auth-helpers';
import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { ethers } from 'ethers';

class Lit {
	litNodeClient = null;

	async connect() {
		if (!this.litNodeClient) {
			this.litNodeClient = new LitJsSdk.LitNodeClient({
				alertWhenUnauthorized: false,
				litNetwork: 'datil-dev',
				debug: false,
			});
			await this.litNodeClient.connect();
		}
	}
	async disconnect() {
		if (this.litNodeClient) {
			await this.litNodeClient.disconnect();
			this.litNodeClient = null;
		}
	}

	async encrypt(message, accessControlConditions) {
		// Encrypt the message
		const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
			{
				accessControlConditions,
				dataToEncrypt: message,
			},
			this.litNodeClient
		);

		// Return the ciphertext and dataToEncryptHash
		return {
			ciphertext,
			dataToEncryptHash,
		};
	}

	async getSessionSignatures() {
		// Connect to the wallet
		console.log(process.env.PRIVATE_KEY)
		const ethWallet = new ethers.Wallet(
			process.env.PRIVATE_KEY,
		);

		// Get the latest blockhash
		const latestBlockhash = await this.litNodeClient.getLatestBlockhash();

		// Define the authNeededCallback function
		const authNeededCallback = async (params) => {
			if (!params.uri) {
				throw new Error("uri is required");
			}
			if (!params.expiration) {
				throw new Error("expiration is required");
			}

			if (!params.resourceAbilityRequests) {
				throw new Error("resourceAbilityRequests is required");
			}

			// Create the SIWE message
			const toSign = await createSiweMessageWithRecaps({
				uri: params.uri,
				expiration: params.expiration,
				resources: params.resourceAbilityRequests,
				walletAddress: ethWallet.address,
				nonce: latestBlockhash,
				litNodeClient: this.litNodeClient,
			});

			// Generate the authSig
			const authSig = await generateAuthSig({
				signer: ethWallet,
				toSign,
			});

			return authSig;
		}

		// Define the Lit resource
		const litResource = new LitAccessControlConditionResource('*');

		// Get the session signatures
		const sessionSigs = await this.litNodeClient.getSessionSigs({
			chain: 'baseSepolia',
			resourceAbilityRequests: [
				{
					resource: litResource,
					ability: LitAbility.AccessControlConditionDecryption,
				},
			],
			authNeededCallback,
		});
		return sessionSigs;
	}

	// @ts-ignore
	async decrypt(ciphertext, dataToEncryptHash, accessControlConditions) {
		// Get the session signatures
		const sessionSigs = await this.getSessionSignatures();

		// Decrypt the message
		const decryptedString = await LitJsSdk.decryptToString(
			{
				accessControlConditions,
				chain: 'baseSepolia',
				ciphertext,
				dataToEncryptHash,
				sessionSigs,
			},
			this.litNodeClient
		);

		// Return the decrypted string
		return { decryptedString };
	}
}

const litClient = new Lit();

const nfc = new NFC(); // optionally you can pass logger
const accessControlConditions = [
	{
		contractAddress: '',
		standardContractType: '',
		chain: 'baseSepolia',
		method: '',
		parameters: [':userAddress'],
		returnValueTest: {
			comparator: '=',
			value: '0xc1fa14cFA7161a9a953Dd428c360fDD8a30A3bB9',
		},
	},
];


const encrypt = async (content) => {

	try {
		await litClient.connect();
		const result = await litClient.encrypt(
			content,
			accessControlConditions
		);
		return result;
	} catch (err) {

		throw err;
	} finally {

		await litClient.disconnect();
	}
};

const decrypt = async (
	encryptedContent,
	encryptedSymmetricKey
) => {

	try {
		await litClient.connect();
		const decrypted = await litClient.decrypt(
			encryptedContent,
			encryptedSymmetricKey,
			accessControlConditions
		);
		return decrypted;
	} catch (err) {
		throw err;
	} finally {
		await litClient.disconnect();
	}
};
const checkEncryptedKey = async (deal, uid) => {
	// TODO: Implement this function with SP SDK
	// console.log(`Device deal is ${deal}`)
	console.log('🔄Retrieving encrypted key from the SignProtocol indexService...');
	const indexService = new IndexService('testnet');
	const res = await indexService.queryAttestationList({
		page: 1,
		mode: "onchain",
		indexingValue: deal,
	});
	console.log('🔄Decoding the encrypted key from the attestation...');
	const approvedAttestations = res.rows.filter((row) => row.schemaId === process.env.APPROVE_SCHEMA)[0];
	const keySetAttestation = res.rows.filter((row) => row.schemaId === process.env.KEYSET_SCHEMA)[0];
	const schemaData = `[
                { "name": "lessor", "type": "address" },
                { "name": "lessee", "type": "address" },
                { "name": "cipherKey", "type": "string" },
                { "name": "keyHash", "type": "string" }
            ]`;
	const decoded = decodeOnChainData(
		keySetAttestation.data,
		DataLocationOnChain.ONCHAIN,
		JSON.parse(schemaData)
	);
	
	console.log('🔄Decrypting the encrypted key with lit protocol...');
	const decrypted = await decrypt(decoded.cipherKey, decoded.keyHash);
	console.log(decrypted.decryptedString === uid?'✅Unlock key match':'❌Unlock key not match')
	console.log(!approvedAttestations.revoked?'✅Deal is active':'❌Deal is not active')
	const isKeyPass = decrypted.decryptedString === uid && !approvedAttestations.revoked;
	console.log(isKeyPass?'✅Unlock success':'❌Unlock failed')
	return isKeyPass
}
nfc.on('reader', reader => {

	console.log(`${reader.reader.name}  device attached`);

	// enable when you want to auto-process ISO 14443-4 tags (standard=TAG_ISO_14443_4)
	// when an ISO 14443-4 is detected, SELECT FILE command with the AID is issued
	// the response is available as card.data in the card event
	// you can set reader.aid to:
	// 1. a HEX string (which will be parsed automatically to Buffer)
	reader.aid = 'F222222222';
	// 2. an instance of Buffer containing the AID bytes
	// reader.aid = Buffer.from('F222222222', 'hex');
	// 3. a function which must return an instance of a Buffer when invoked with card object (containing standard and atr)
	//    the function may generate AIDs dynamically based on the detected card
	// reader.aid = ({ standard, atr }) => {
	//
	// 	return Buffer.from('F222222222', 'hex');
	//
	// };
	// getEncryptedKey("DealAddress").then(
	// 	(res) => {
	// 		decrypt(res.ciphertext, res.dataToEncryptHash).then(
	// 			(res) => console.log(res.decryptedString === '7bd0e33c'))
	// 	});
	reader.on('card', card => {

		// card is object containing following data
		// [always] String type: TAG_ISO_14443_3 (standard nfc tags like MIFARE) or TAG_ISO_14443_4 (Android HCE and others)
		// [always] String standard: same as type
		// [only TAG_ISO_14443_3] String uid: tag uid
		// [only TAG_ISO_14443_4] Buffer data: raw data from select APDU response

		console.log(`${reader.reader.name}  card detected`, card.uid);
		checkEncryptedKey(
			process.env.DEAL_ADDRESS,
			card.uid)
	});

	reader.on('card.off', card => {
		// console.log(`${reader.reader.name}  card removed`, card);
	});

	reader.on('error', err => {
		console.log(`${reader.reader.name}  an error occurred`, err);
	});

	reader.on('end', () => {
		// console.log(`${reader.reader.name}  device removed`);
	});

});

nfc.on('error', err => {
	console.log('an error occurred', err);
});
