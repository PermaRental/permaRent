import hre from "hardhat";
import PermaRent from "../ignition/modules/PermaRent";
import PermaReputationPoints from "../ignition/modules/PermaReputationPoints";
import PermaSPHook from "../ignition/modules/PermaSPHook";
import WorldVerifier from "../ignition/modules/WorldVerifier";
import {
    SignProtocolClient,
    SpMode,
    EvmChains,
    DataLocationOnChain,
} from '@ethsign/sp-sdk';
import { privateKeyToAccount } from "viem/accounts";
async function main() {
    let spHookContract, permaRentDealApprovedSchema;
    let PRPContract, worldVerifierContract, permaRentContract;
    if (!process.env.PERMA_RENT_SCHEMA) {
        const { spHook } = await hre.ignition.deploy(PermaSPHook, {});
        const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)
        const client = new SignProtocolClient
            (SpMode.OnChain, {
                chain: EvmChains.baseSepolia,
                account: account, // optional
            });

        permaRentDealApprovedSchema = await client.createSchema({
            name: "permaRentDealApproved",
            registrant: account.address as `0x${string}`,
            dataLocation: DataLocationOnChain.ONCHAIN,
            revocable: true,
            hook: spHook.target as `0x${string}`,
            data: [
                { name: "lessor", type: "address" },
                { name: "lesseeAddress", type: "address" },
                { name: "totalInitialPayment", type: "uint256" },
                { name: "terms.totalRentalPeriods", type: "uint256" },
                { name: "terms.rentalAmount", type: "uint256" },
                { name: "terms.securityDeposit", type: "uint256" },
                { name: "terms.paymentInterval", type: "uint256" },
                { name: "terms.dealHash", type: "string" },
                { name: "cipherKey", type: "string" },
            ]
        })
        spHookContract = spHook;
        console.log('permaRentDealApprovedSchema:', permaRentDealApprovedSchema.schemaId);
        console.log(`spHook deployed to: ${spHook.target}`);
    } else {
        permaRentDealApprovedSchema = { schemaId: process.env.PERMA_RENT_SCHEMA };
        spHookContract = await hre.ethers.getContractAt("PermaSPHook", process.env.HOOK_ADDRESS as string);
    }

    if (!process.env.PRP_ADDRESS) {
        const { PRP } = await hre.ignition.deploy(PermaReputationPoints, {
            parameters: {
                PermaReputationPoints: {
                    signProtocolHookAddress: spHookContract.target as string,
                }
            },
        });
        PRPContract = PRP;
    } else {
        PRPContract = await hre.ethers.getContractAt("PermaReputationPoints", process.env.PRP_ADDRESS as string);
    }
    console.log(`PRP deployed to: ${PRPContract.target}`);
    if (!process.env.WORLD_VERIFIER_ADDRESS) {
        const { worldVerifier } = await hre.ignition.deploy(WorldVerifier, {
            parameters: {
                WorldVerifier: {
                    worldIdAddress: process.env.WORLD_ID_ADDRESS as string,
                    worldAppID: process.env.WORLD_APP_ID as string,
                },
            },
        });
        worldVerifierContract = worldVerifier;
    }
    else {
        worldVerifierContract = await hre.ethers.getContractAt("WorldVerifier", process.env.WORLD_VERIFIER_ADDRESS as string);
    }
    console.log(`worldVerifier deployed to: ${worldVerifierContract.target}`);
    const { permaRent } = await hre.ignition.deploy(PermaRent, {
        parameters: {
            PermaRent: {
                schemaId: permaRentDealApprovedSchema.schemaId,
                worldVerifierAddress: worldVerifierContract.target as string,
                spAddress: process.env.SIGN_PROTOCOL_ADDRESS as string,
                PRPAddress: PRPContract.target as string,
                spHookAddress: spHookContract.target as string,
            },
        },
    });
    console.log(`permaRent deployed to: ${permaRent.target}`);
}


main().catch(console.error);