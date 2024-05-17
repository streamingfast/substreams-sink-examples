import { log } from "@graphprotocol/graph-ts";
import { USDTExchangeList } from "./pb/sf/substreams/cosmos/v1/USDTExchangeList";
import { USDTExchangeVolume } from "../generated/schema";
import { Protobuf } from 'as-proto/assembly';
import { BigInt } from '@graphprotocol/graph-ts'

const ID = "one";

export function handleExchanges(bytes: Uint8Array): void {
    const usdtExchangeList: USDTExchangeList = Protobuf.decode<USDTExchangeList>(bytes, USDTExchangeList.decode);
    const exchanges = usdtExchangeList.exchanges;

    log.info("Protobuf decoded, length: {}", [exchanges.length.toString()]);

    let entity = USDTExchangeVolume.load(ID);
    if (entity == null) {
        log.info("Entity not found, creating one...", []);
        entity = new USDTExchangeVolume(ID);
        entity.amount = '0';
    }

    for (let i = 0; i < exchanges.length; i++) {
        const exchange = exchanges[i];
        log.info("Exchange with amount: {}", [exchange.amount]);
        const exchangeAmount = BigInt.fromString(exchange.amount);

        const entityAmount = BigInt.fromString(entity.amount);
        const sumResult = entityAmount.plus(exchangeAmount);
        log.info("Amount added: {}", [entityAmount.toString()]);

        entity.amount = sumResult.toString();
        entity.save();
        log.info("Entity saved: {}", [entity.amount]);
    }
}