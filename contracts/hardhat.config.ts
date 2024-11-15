import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "hardhat-contract-sizer"
import dotenv from 'dotenv';
dotenv.config();
const config: HardhatUserConfig = {
  mocha: {
    timeout: 100000000
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 66,
      },
    },
  },
  ignition: {
    requiredConfirmations: 1
  },
  networks: {
    hardhat: {
      mining: {
        auto: true,
        interval: 10
      },
      forking: {
        url: "https://base-sepolia.g.alchemy.com/v2/Uye7DOCgmKHvFB8vOHGyC_sh4ysKjQNb",
        blockNumber: 9535700,
      },
      accounts: [
        // process.env.PRIVATE_KEY as string, process.env.PRIVATE_KEY2 as string]
        {privateKey:process.env.PRIVATE_KEY as string,balance: "100000000000000000000000"},

        {privateKey:process.env.PRIVATE_KEY2 as string,balance: "100000000000000000000000"},

        {privateKey:process.env.PRIVATE_KEY3 as string,balance: "100000000000000000000000"}
      ]
    },

    'base_sepolia': {
      url: 'https://base-sepolia.g.alchemy.com/v2/Uye7DOCgmKHvFB8vOHGyC_sh4ysKjQNb',
      accounts: [
        process.env.PRIVATE_KEY as string,
      ]
    }
  }

};

export default config;
