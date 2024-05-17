import { describe, test, assert, beforeAll } from "matchstick-as";
import { BigInt } from '@graphprotocol/graph-ts'
import { log } from "@graphprotocol/graph-ts";

describe("Asserts", () => {
    test("plus", () => {
        const exchangeAmountAsString = '100000000'
        const entityAmountAsString = '0'

        const exchangeAmount = BigInt.fromString(exchangeAmountAsString)
        const entityAmount = BigInt.fromString(entityAmountAsString)

        const result = entityAmount.plus(exchangeAmount);

        log.info("{}", [result.toString()])
    });
});