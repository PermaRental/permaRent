import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as"
import { Address } from "@graphprotocol/graph-ts"
import { DealCreated } from "../generated/schema"
import { DealCreated as DealCreatedEvent } from "../generated/PermaRent/PermaRent"
import { handleDealCreated } from "../src/perma-rent"
import { createDealCreatedEvent } from "./perma-rent-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let deal = Address.fromString("0x0000000000000000000000000000000000000001")
    let paymentToken = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let lessor = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let terms = "ethereum.Tuple Not implemented"
    let newDealCreatedEvent = createDealCreatedEvent(
      deal,
      paymentToken,
      lessor,
      terms
    )
    handleDealCreated(newDealCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("DealCreated created and stored", () => {
    assert.entityCount("DealCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "DealCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "deal",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "DealCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "paymentToken",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "DealCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "lessor",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "DealCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "terms",
      "ethereum.Tuple Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
