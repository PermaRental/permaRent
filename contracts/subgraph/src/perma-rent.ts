import { BigInt } from "@graphprotocol/graph-ts";
import { DealCreated as DealCreatedEvent } from "../generated/PermaRent/PermaRent"
import { Deal } from "../generated/schema";
import { PermaRentDeal as PermaRentDealTemplate } from "../generated/templates";

export function handleDealCreated(event: DealCreatedEvent): void {

  let entity = new Deal(
    event.params.deal.toHex()
  )
  entity.id = event.params.deal.toHex()
  entity.paymentToken = event.params.paymentToken
  entity.lessor = event.params.lessor
  
  entity.rentalAmount = event.params.terms.rentalAmount
  entity.securityDeposit = event.params.terms.securityDeposit
  entity.paymentInterval = event.params.terms.paymentInterval
  entity.totalRentalPeriods = event.params.terms.totalRentalPeriods
  entity.dealHash = event.params.terms.dealHash
  entity.lessees = [];
  entity.refundSettledAmount = BigInt.fromI32(0)
  entity.failedPaymentCount = BigInt.fromI32(0)
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // 動態新增 PermaRentDeal 合約作為資料來源，以監聽其事件
  PermaRentDealTemplate.create(event.params.deal);
}
