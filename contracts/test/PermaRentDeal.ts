import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("PermaRentDeal", function () {
  async function deployPermaRentDealFixture() {
    const [owner, lessor, lessee, otherAccount] = await hre.ethers.getSigners();
    let schemaId = 0;
    let keySchemaId = 0;
    const prpToken = await hre.ethers.getContractFactory("PermaReputationPoints");
    const paymentToken = await hre.ethers.getContractFactory("MockUSDC");
    const hook = await hre.ethers.getContractFactory("PermaSPHook");
    const hookInstance = await hook.deploy();
    const prpTokenInstance = await prpToken.deploy(hookInstance.target);
    const paymentTokenInstance = await paymentToken.deploy(owner.address);
    const worldVerifier = await hre.ethers.getContractFactory("WorldVerifier");

    const signProtocolInstance = await hre.ethers.getContractAt("MockSP", process.env.SIGN_PROTOCOL_ADDRESS as string);

    // const worldIdInstance = await hre.ethers.getContractAt("MockWorldID", process.env.WORLD_ID_ADDRESS as string);
    const worldId = await hre.ethers.getContractFactory("MockWorldID");
    const worldIdInstance = await worldId.deploy();
    const worldVerifierInstance = await worldVerifier.deploy(worldIdInstance.target, "appID");

    const schemaTx = await signProtocolInstance.register(
      {
        registrant: owner.address,
        dataLocation: 0,
        revocable: true,
        maxValidFor: 0n,
        hook: hookInstance.target,
        timestamp: 0n,
        data: JSON.stringify([
          { name: "lessor", type: "address"},
          { name: "lessee", type: "address"},
          { name: "totalInitialPayment", type: "uint256"},
          { name: "totalRentalPeriods", type: "uint256"},
          { name: "rentalAmount", type: "uint256"},
          { name: "securityDeposit", type: "uint256"},
          { name: "paymentInterval", type: "uint256"},
          { name: "dealHash", type: "string"},
        ]),
      }, "0x");
    const schemaReceipt = await schemaTx.wait();
    for (const log of schemaReceipt.logs) {
      try {
        // Attempt to parse the log with the contract's interface
        const parsedLog = signProtocolInstance.interface.parseLog(log);
        console.log("Decoded Log:", parsedLog);
  
        // Access specific information from the parsed log
        console.log("Event Name:", parsedLog.name);
        console.log("Event Args:", parsedLog.args);
  
        // Example: Access a specific argument by name
        if (parsedLog.name === "SchemaRegistered") {
          schemaId = parsedLog.args.schemaId;
        }
      } catch (e) {
        // Not all logs are related to this contract, so skip those that can't be parsed
        console.log("Log could not be parsed by this contract's interface.");
      }
    }
    const keySchemaTx = await signProtocolInstance.register(
      {
        registrant: owner.address,
        dataLocation: 0,
        revocable: true,
        maxValidFor: 0n,
        hook: hookInstance.target,
        timestamp: 0n,
        data: JSON.stringify([
          { name: "lessor", type: "address"},
          { name: "lessee", type: "address"},
          { name: "cipherKey", type: "string"},
          { name: "keyHash", type: "string"},
        ]),
      }, "0x");
    const keySchemaReceipt = await keySchemaTx.wait();
    for (const log of keySchemaReceipt.logs) {
      try {
        // Attempt to parse the log with the contract's interface
        const parsedLog = signProtocolInstance.interface.parseLog(log);
        console.log("Decoded Log:", parsedLog);
  
        // Access specific information from the parsed log
        console.log("Event Name:", parsedLog.name);
        console.log("Event Args:", parsedLog.args);
  
        // Example: Access a specific argument by name
        if (parsedLog.name === "SchemaRegistered") {
          keySchemaId = parsedLog.args.schemaId;
        }
      } catch (e) {
        // Not all logs are related to this contract, so skip those that can't be parsed
        console.log("Log could not be parsed by this contract's interface.");
      }
    }


    const rentalAmount = hre.ethers.parseEther("1");
    const securityDeposit = hre.ethers.parseEther("5");
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

    const PermaRent = await hre.ethers.getContractFactory("PermaRent");
    const PermaRentInstance = await PermaRent.deploy(
      signProtocolInstance.target,
      hookInstance.target,
      prpTokenInstance.target,
      worldVerifierInstance.target,
      schemaId,
      keySchemaId
    );

    await hookInstance.setPerma(PermaRentInstance.target);
    const permaRentDealTx = await PermaRentInstance.deployDeal(
      paymentTokenInstance.target,
      lessor.address,
      dealTerms
    );
    const permaRentDealReceipt = await permaRentDealTx.wait();
    let permaRentDealAddress = "";
    for (const log of permaRentDealReceipt.logs) {
      try {
        // Attempt to parse the log with the contract's interface
        const parsedLog = PermaRentInstance.interface.parseLog(log);
        console.log("Decoded Log:", parsedLog);
  
        // Access specific information from the parsed log
        console.log("Event Name:", parsedLog.name);
        console.log("Event Args:", parsedLog.args);
  
        // Example: Access a specific argument by name
        if (parsedLog.name === "DealCreated") {
          permaRentDealAddress = parsedLog.args.deal;
        }
      } catch (e) {
        // Not all logs are related to this contract, so skip those that can't be parsed
        console.log("Log could not be parsed by this contract's interface.");
      }
    }
    const permaRentDeal = await hre.ethers.getContractAt("PermaRentDeal", permaRentDealAddress);    

    await paymentTokenInstance.mint(lessee.address, hre.ethers.parseEther("100"));
    await paymentTokenInstance.connect(lessee).approve(permaRentDeal.target, hre.ethers.parseEther("100"));

    return {
      permaRentDeal,
      prpTokenInstance,
      paymentTokenInstance,
      signProtocolInstance,
      worldVerifierInstance,
      owner,
      lessor,
      lessee,
      otherAccount,
      dealTerms,
    };
  }

  describe("Deployment", function () {
    it("Should set the lessor correctly", async function () {
      const { permaRentDeal, lessor } = await loadFixture(deployPermaRentDealFixture);
      expect(await permaRentDeal.lessor()).to.equal(lessor.address);
    });
  });

  describe("Signing and Approving Deal", function () {
    it("Lessee should sign the deal", async function () {
      const { permaRentDeal, lessee } = await loadFixture(deployPermaRentDealFixture);
      await expect(permaRentDeal.connect(lessee).signDealAsLessee(1, 1, [0, 0, 0, 0, 0, 0, 0, 0]))
        .to.emit(permaRentDeal, "DealSignedByLessee")
        .withArgs(permaRentDeal.target, lessee.address);
    });

    it("Lessor should approve the deal for the lessee", async function () {
      const { permaRentDeal, lessor, lessee } = await loadFixture(deployPermaRentDealFixture);
      await permaRentDeal.connect(lessee).signDealAsLessee(1, 2, [0, 0, 0, 0, 0, 0, 0, 0]);

      await expect(permaRentDeal.connect(lessor).approveDealForLessee(lessee.address, 1, 3, [0, 0, 0, 0, 0, 0, 0, 0]))
        .to.emit(permaRentDeal, "DealApprovedByLessor")
        .withArgs(permaRentDeal.target, lessor.address, lessee.address, anyValue, anyValue);
    });
  });

  describe("Payments", function () {
    it("Should allow lessee to make a payment", async function () {
      const { permaRentDeal, lessor, lessee, dealTerms } = await loadFixture(deployPermaRentDealFixture);

      await permaRentDeal.connect(lessee).signDealAsLessee(1, 4, [0, 0, 0, 0, 0, 0, 0, 0]);
      await permaRentDeal.connect(lessor).approveDealForLessee(lessee.address, 1, 5, [0, 0, 0, 0, 0, 0, 0, 0]);

      await time.increase(dealTerms.paymentInterval);

      await expect(permaRentDeal.connect(lessee).makePayment())
        .to.emit(permaRentDeal, "PaymentMade")
        .withArgs(permaRentDeal.target, lessee.address, dealTerms.rentalAmount, 1, anyValue);
    });

    it("Should record failed payment if lessee lacks balance", async function () {
      const { permaRentDeal, lessor, lessee, paymentTokenInstance, dealTerms } = await loadFixture(deployPermaRentDealFixture);

      await permaRentDeal.connect(lessee).signDealAsLessee(1, 6, [0, 0, 0, 0, 0, 0, 0, 0]);
      await permaRentDeal.connect(lessor).approveDealForLessee(lessee.address, 1, 7, [0, 0, 0, 0, 0, 0, 0, 0]);

      await paymentTokenInstance.connect(lessee).transfer(lessor.address, await paymentTokenInstance.balanceOf(lessee.address));
      await time.increase(dealTerms.paymentInterval);

      await expect(permaRentDeal.connect(lessee).makePayment())
        .to.emit(permaRentDeal, "PaymentFailed")
        .withArgs(permaRentDeal.target, lessee.address, dealTerms.rentalAmount, 1, anyValue);
    });
  });

  describe("Refund and Termination", function () {
    it("Lessor should set refund amount and lessee can claim it", async function () {
      const { permaRentDeal, lessor, lessee, dealTerms } = await loadFixture(deployPermaRentDealFixture);

      await permaRentDeal.connect(lessee).signDealAsLessee(1, 8, [0, 0, 0, 0, 0, 0, 0, 0]);
      await permaRentDeal.connect(lessor).approveDealForLessee(lessee.address, 1, 9, [0, 0, 0, 0, 0, 0, 0, 0]);

      await permaRentDeal.connect(lessor).setDepositRefund(dealTerms.securityDeposit);

      await expect(permaRentDeal.connect(lessee).claimRefund())
        .to.emit(permaRentDeal, "DepositRefunded")
        .withArgs(permaRentDeal.target, lessee.address, dealTerms.securityDeposit, 0);
    });

    it("Should allow lessor to terminate the deal after failed payment", async function () {
      const { permaRentDeal, lessor, lessee, paymentTokenInstance, dealTerms } = await loadFixture(deployPermaRentDealFixture);

      await permaRentDeal.connect(lessee).signDealAsLessee(1, 10, [0, 0, 0, 0, 0, 0, 0, 0]);
      await permaRentDeal.connect(lessor).approveDealForLessee(lessee.address, 1, 11, [0, 0, 0, 0, 0, 0, 0, 0]);

      await paymentTokenInstance.connect(lessee).transfer(lessor.address, await paymentTokenInstance.balanceOf(lessee.address));
      await time.increase(dealTerms.paymentInterval);

      await permaRentDeal.connect(lessee).makePayment();

      await expect(permaRentDeal.connect(lessor).terminateDeal())
        .to.emit(permaRentDeal, "DealTerminated")
        .withArgs(permaRentDeal.target, lessor.address, anyValue);
    });
  });

  describe("Cipher Key Management", function () {
    it("Lessee should be able to set cipher key after approval", async function () {
      const { permaRentDeal, lessor, lessee } = await loadFixture(deployPermaRentDealFixture);

      await permaRentDeal.connect(lessee).signDealAsLessee(1, 12, [0, 0, 0, 0, 0, 0, 0, 0]);
      await permaRentDeal.connect(lessor).approveDealForLessee(lessee.address, 1, 11, [0, 0, 0, 0, 0, 0, 0, 0]);

      await permaRentDeal.connect(lessee).setCipherKey({cipherKey:"myCipherKey",keyHash:"myKeyHash"});
      const key = await permaRentDeal.key();
      expect(key.cipherKey).to.equal("myCipherKey");
      expect(key.keyHash).to.equal("myKeyHash");
    });
  });
});
