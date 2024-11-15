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
  private litNodeClient: LitJsSdk.LitNodeClient =
    null as unknown as LitJsSdk.LitNodeClient;

  async connect() {
    if (!this.litNodeClient) {
      this.litNodeClient = new LitJsSdk.LitNodeClient({
        alertWhenUnauthorized: false,
        litNetwork: 'datil-dev',
        debug: true,
      });
      await this.litNodeClient.connect();
    }
  }
  async disconnect() {
    if (this.litNodeClient) {
      await this.litNodeClient.disconnect();
      this.litNodeClient = null as unknown as LitJsSdk.LitNodeClient;
    }
  }

  async encrypt(message: string, accessControlConditions: any[]) {
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
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();
    console.log('Connected account:', walletAddress);
    console.log(await provider.getNetwork());
    // Get the latest blockhash
    const latestBlockhash = await this.litNodeClient.getLatestBlockhash();

    // Define the authNeededCallback function
    // @ts-ignore
    const authNeededCallback = async (params) => {
      if (!params.uri) {
        throw new Error('uri is required');
      }
      if (!params.expiration) {
        throw new Error('expiration is required');
      }

      if (!params.resourceAbilityRequests) {
        throw new Error('resourceAbilityRequests is required');
      }

      // Create the SIWE message
      const toSign = await createSiweMessageWithRecaps({
        uri: params.uri,
        expiration: params.expiration,
        resources: params.resourceAbilityRequests,
        walletAddress: walletAddress,
        nonce: latestBlockhash,
        litNodeClient: this.litNodeClient,
      });

      // Generate the authSig
      const authSig = await generateAuthSig({
        signer: signer,
        toSign,
      });

      return authSig;
    };

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

export const litClient = new Lit();
