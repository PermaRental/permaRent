import { BigInt } from "@graphprotocol/graph-ts";
import {
    DealApprovedByLessor,
    DealSignedByLessee,
    DepositRefundSetted,
    PaymentMade,
    PaymentFailed,
    DepositRefunded,
    DealTerminated,
    CipherKeySet
} from "../generated/templates/PermaRentDeal/PermaRentDeal";
import { Deal } from "../generated/schema";

export function handleDealSignedByLessee(event: DealSignedByLessee): void {
    let deal = Deal.load(event.params.deal.toHex());
    if (deal == null) return;

    // 更新 Deal 狀態
    let lessees = deal.lessees;
    lessees.push(event.params.lessee);
    deal.lessees = lessees;

    deal.save();
}

export function handleDealApprovedByLessor(event: DealApprovedByLessor): void {
    let deal = Deal.load(event.params.deal.toHex());
    if (deal == null) return;

    // 更新 Deal 狀態
    deal.approvedTimestamp = event.block.timestamp;
    deal.approvalAttestationId = event.params.attestationId;
    deal.finalLessee = event.params.lessee;
    deal.save();
}

export function handlePaymentMade(event: PaymentMade): void {
    let deal = Deal.load(event.params.deal.toHex());
    if (deal == null) return;

    // 更新付款資訊
    deal.lastPaymentTimestamp = event.block.timestamp;
    deal.currentPeriod = event.params.period;

    deal.save();
}

export function handlePaymentFailed(event: PaymentFailed): void {
    let deal = Deal.load(event.params.deal.toHex());
    if (deal == null) return;

    // 更新付款失敗資訊
    deal.failedPaymentCount = deal.failedPaymentCount.minus(BigInt.fromI32(-1));

    deal.save();
}

export function handleDepositRefundSetted(event: DepositRefundSetted): void {
    let deal = Deal.load(event.params.deal.toHex());
    if (deal == null) return;

    // 更新押金退款資訊
    deal.refundSettledAmount = event.params.refundAmount;

    deal.save();
}

export function handleDepositRefunded(event: DepositRefunded): void {
    let deal = Deal.load(event.params.deal.toHex());
    if (deal == null) return;

    // 更新押金退款資訊
    deal.refundAmount = event.params.refundAmount;
    deal.remainingDeposit = event.params.remainingDeposit;

    deal.save();
}

export function handleDealTerminated(event: DealTerminated): void {
    let deal = Deal.load(event.params.deal.toHex());
    if (deal == null) return;

    // 更新 Deal 終止狀態
    deal.terminatedTimestamp = event.block.timestamp;

    deal.save();
}

export function handleCipherKeySet(event: CipherKeySet): void {
    let deal = Deal.load(event.params.deal.toHex());
    if (deal == null) return;

    // 更新密鑰
    deal.cipherKey = event.params.cipherKey;
    deal.keyHash = event.params.keyHash;

    deal.save();
}
