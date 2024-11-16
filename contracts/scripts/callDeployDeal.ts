import hre from "hardhat";
import { privateKeyToAccount } from "viem/accounts";
async function main() {
    const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)
    const dealRent = await hre.ethers.getContractAt("PermaRent", process.env.PERMA_ADDRESS as string);

    const rentalAmount = 1000000;
    const securityDeposit = 5000000;
    const paymentInterval = 30 * 24 * 60 * 60; // 30 days
    const totalRentalPeriods = 6;
    const dealHash = "sampleDealHash";

    const dealTerms = {
        rentalAmount,
        securityDeposit,
        paymentInterval,
        totalRentalPeriods,
        dealHash,
    };
    await dealRent.deployDeal(
        process.env.USDC_ADDRESS as string,
        account.address,
        dealTerms
    )
}

main().catch(console.error);