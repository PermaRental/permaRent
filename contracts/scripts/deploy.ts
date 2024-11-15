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
async function main() {
    const [deployer] = await hre.ethers.getSigners();

    const { spHook } = await hre.ignition.deploy(PermaSPHook, {});
    const client = new SignProtocolClient
        (SpMode.OnChain, {
            chain: EvmChains.baseSepolia,
            account: deployer, // optional
        });

    const permaRentDealApprovedSchema = await client.createSchema({
        name: "permaRentDealApproved",
        registrant: deployer.address as `0x${string}`,
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

    console.log('permaRentDealApprovedSchema:', permaRentDealApprovedSchema.schemaId);
    console.log(`spHook deployed to: ${spHook.target}`);

    const { PRP } = await hre.ignition.deploy(PermaReputationPoints, {
        parameters: {
            PermaReputationPoints: {
                signProtocolHookAddress: spHook.target as string,
            }
        },
    });
    console.log(`PRP deployed to: ${PRP.target}`);
    const { worldVerifier } = await hre.ignition.deploy(WorldVerifier, {
        parameters: {
            WorldVerifier: {
                worldIdAddress: process.env.WORLD_ID_ADDRESS as string,
                worldAppID: process.env.WORLD_APP_ID as string,
            },
        },
    });
    console.log(`worldVerifier deployed to: ${worldVerifier.target}`);
    const { permaRent } = await hre.ignition.deploy(PermaRent, {
        parameters: {
            PermaRent: {
                schemaId: permaRentDealApprovedSchema.schemaId,
                worldVerifierAddress: worldVerifier.target as string,
                spAddress: process.env.SIGN_PROTOCOL_ADDRESS as string,
                PRPAddress: PRP.target as string,
                spHookAddress: spHook.target as string,
            },
        },
    });
    console.log(`permaRent deployed to: ${permaRent.target}`);
}


main().catch(console.error);