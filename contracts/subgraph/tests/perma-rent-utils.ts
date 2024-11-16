import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { DealCreated } from "../generated/PermaRent/PermaRent"

export function createDealCreatedEvent(
  deal: Address,
  paymentToken: Address,
  lessor: Address,
  terms: ethereum.Tuple
): DealCreated {
  let dealCreatedEvent = changetype<DealCreated>(newMockEvent())

  dealCreatedEvent.parameters = new Array()

  dealCreatedEvent.parameters.push(
    new ethereum.EventParam("deal", ethereum.Value.fromAddress(deal))
  )
  dealCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "paymentToken",
      ethereum.Value.fromAddress(paymentToken)
    )
  )
  dealCreatedEvent.parameters.push(
    new ethereum.EventParam("lessor", ethereum.Value.fromAddress(lessor))
  )
  dealCreatedEvent.parameters.push(
    new ethereum.EventParam("terms", ethereum.Value.fromTuple(terms))
  )

  return dealCreatedEvent
}
