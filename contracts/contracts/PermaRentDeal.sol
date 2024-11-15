// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ISP, Attestation} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {DataLocation} from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";
import {IWorldVerifier} from "./interfaces/IWorldVerifier.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract PermaRentDeal {
    IERC20 public paymentToken;
    IERC20 public prpToken;

    address public lessor;
    address public finalLessee;
    bool public isDealActive = false;
    ISP public signProtocol;
    IWorldVerifier public worldVerifier;
    uint64 public immutable schemaId;
    uint256 public startDate;
    uint256 public agreedRefundAmount = 0; // 出租方設定的押金返還金額
    uint256 public refundClaimed = 0; // 記錄已退還的押金金額
    uint256 public currentPeriod = 0; // 目前已支付的租金期數
    uint256 public failedPayments = 0; // 支付失敗的次數
    uint64 public approvedAttestationId = 0; // 出租方批准的 attestationId
    string public cipherKey;

    struct DealTerms {
        uint256 rentalAmount; // 每期租金金額
        uint256 securityDeposit; // 押金金額
        uint256 paymentInterval; // 租金支付間隔（以秒為單位）
        uint256 totalRentalPeriods; // 總租賃期數
        string dealHash; // 租賃合約的文件哈希
    }

    DealTerms public terms; // 租賃合約條款

    struct Lessee {
        bool signed; // 承租方是否已簽署
        bool approved; // 是否被出租方批准
    }

    mapping(address => Lessee) public lessees; // 儲存每個 lessee 的簽署和批准狀態

    event DealSignedByLessee(address indexed lessee);
    event DealApprovedByLessor(
        address indexed lessor,
        address indexed lessee,
        uint256 startDate,
        uint256 attestationId
    );
    event PaymentMade(
        address indexed payer,
        uint256 amount,
        uint256 period,
        uint256 timestamp
    );
    event PaymentFailed(
        address indexed lessee,
        uint256 amount,
        uint256 period,
        uint256 timestamp
    );
    event DepositRefundSetted(address indexed lessor, uint256 refundAmount);
    event DepositRefunded(
        address indexed lessee,
        uint256 refundAmount,
        uint256 remainingDeposit
    );
    event DealTerminated(address indexed initiator, uint256 timestamp);
    event CipherKeySet(address indexed user, string cipherKey);

    constructor(
        address _signProtocol,
        address _prpToken,
        address _paymentToken,
        address _worldVerifier,
        address _lessor,
        uint64 _schemaId,
        DealTerms memory _terms
    ) {
        paymentToken = IERC20(_paymentToken);
        prpToken = IERC20(_prpToken);
        signProtocol = ISP(_signProtocol);
        worldVerifier = IWorldVerifier(_worldVerifier);
        lessor = _lessor;
        schemaId = _schemaId;
        terms = _terms;
    }

    modifier onlyLessor() {
        require(msg.sender == lessor, "Only the lessor can call this function");
        _;
    }

    modifier onlyApprovedLessee() {
        require(
            lessees[msg.sender].approved,
            "Only an approved lessee can call this function"
        );
        _;
    }

    modifier dealActive() {
        require(isDealActive, "Deal is not active");
        _;
    }

    function signDealAsLessee(
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        require(!lessees[msg.sender].signed, "Lessee already signed");

        uint256 totalInitialPayment = terms.rentalAmount +
            terms.securityDeposit;
        require(
            paymentToken.balanceOf(msg.sender) >= totalInitialPayment,
            "Insufficient balance for rental payment"
        );
        require(
            paymentToken.allowance(msg.sender, address(this)) >=
                terms.rentalAmount * terms.totalRentalPeriods,
            "Insufficient allowance for rental payment"
        );

        worldVerifier.verifyWorldSignAction(
            address(this),
            root,
            nullifierHash,
            proof
        );
        lessees[msg.sender].signed = true;
        emit DealSignedByLessee(msg.sender);
    }

    function approveDealForLessee(
        address lesseeAddress,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external onlyLessor {
        require(lessees[lesseeAddress].signed, "Lessee has not signed");
        require(!lessees[lesseeAddress].approved, "Lessee already approved");

        worldVerifier.verifyWorldSignAction(
            address(this),
            root,
            nullifierHash,
            proof
        );
        uint256 totalInitialPayment = terms.rentalAmount +
            terms.securityDeposit;
        require(
            paymentToken.balanceOf(lesseeAddress) >= totalInitialPayment,
            "Insufficient balance for initial payment"
        );
        require(
            paymentToken.allowance(lesseeAddress, address(this)) >=
                totalInitialPayment,
            "Insufficient allowance for initial payment"
        );

        paymentToken.transferFrom(lesseeAddress, lessor, terms.rentalAmount);
        paymentToken.transferFrom(
            lesseeAddress,
            address(this),
            terms.securityDeposit
        );

        startDate = block.timestamp;
        isDealActive = true;
        lessees[lesseeAddress].approved = true;
        finalLessee = lesseeAddress;

        Attestation memory attestation = Attestation({
            schemaId: schemaId,
            linkedAttestationId: 0,
            attestTimestamp: uint64(block.timestamp),
            revokeTimestamp: 0,
            attester: address(this),
            validUntil: 0,
            dataLocation: DataLocation.ONCHAIN,
            revoked: false,
            recipients: new bytes[](1),
            data: abi.encode(
                lessor,
                lesseeAddress,
                totalInitialPayment,
                terms.totalRentalPeriods,
                terms.rentalAmount,
                terms.securityDeposit,
                terms.paymentInterval,
                terms.dealHash,
                cipherKey
            )
        });
        attestation.recipients[0] = (abi.encode(lesseeAddress));
        approvedAttestationId = signProtocol.attest(
            attestation,
            prpToken,
            1,
            string(
                abi.encodePacked(
                    Strings.toHexString(uint256(uint160(address(this)))),
                    "_",
                    Strings.toString(uint256(uint160(lessor))),
                    "_",
                    Strings.toHexString(uint256(uint160(lesseeAddress)))
                )
            ),
            "",
            abi.encode(lessor, lesseeAddress)
        );

        emit DealApprovedByLessor(
            lessor,
            lesseeAddress,
            startDate,
            approvedAttestationId
        );
        emit PaymentMade(
            lesseeAddress,
            terms.rentalAmount,
            currentPeriod,
            block.timestamp
        );
    }

    function makePayment() external dealActive onlyApprovedLessee {
        require(currentPeriod < terms.totalRentalPeriods, "All periods paid");
        require(
            block.timestamp >=
                startDate + terms.paymentInterval * (currentPeriod + 1),
            "Payment not yet due"
        );

        if (
            paymentToken.balanceOf(msg.sender) >= terms.rentalAmount &&
            paymentToken.allowance(msg.sender, address(this)) >=
            terms.rentalAmount
        ) {
            paymentToken.transferFrom(msg.sender, lessor, terms.rentalAmount);
            currentPeriod++;
            failedPayments = 0;
            emit PaymentMade(
                msg.sender,
                terms.rentalAmount,
                currentPeriod,
                block.timestamp
            );
        } else {
            failedPayments++;
            emit PaymentFailed(
                msg.sender,
                terms.rentalAmount,
                currentPeriod + 1,
                block.timestamp
            );
        }
    }

    function setDepositRefund(uint256 refundAmount) external onlyLessor {
        require(isDealActive, "Deal is not active");
        require(
            refundAmount <= terms.securityDeposit,
            "Refund amount exceeds security deposit"
        );

        agreedRefundAmount = refundAmount;
        emit DepositRefundSetted(lessor, refundAmount);
    }

    function claimRefund() external onlyApprovedLessee {
        require(agreedRefundAmount > 0, "No refund amount set by lessor");

        refundClaimed = agreedRefundAmount;
        paymentToken.transfer(msg.sender, agreedRefundAmount);

        uint256 remainingDeposit = terms.securityDeposit - agreedRefundAmount;
        if (remainingDeposit > 0) {
            paymentToken.transfer(lessor, remainingDeposit);
        }

        isDealActive = false;
        emit DepositRefunded(msg.sender, agreedRefundAmount, remainingDeposit);
    }

    function terminateDeal() external onlyLessor {
        require(
            refundClaimed != 0 ||
                (failedPayments > 0 &&
                    block.timestamp >=
                    startDate + terms.paymentInterval * (currentPeriod + 1)),
            "Cannot terminate unless refund claimed or payment failed"
        );
        signProtocol.revoke(
            uint64(approvedAttestationId),
            "",
            "",
            abi.encode(lessor, finalLessee)
        );
        emit DealTerminated(msg.sender, block.timestamp);
    }

    function setCipherKey(string calldata _cipherKey) external {
        require(
            finalLessee == msg.sender && isDealActive,
            "Only the lessee can set the cipher key"
        );
        cipherKey = _cipherKey;
    }
}
