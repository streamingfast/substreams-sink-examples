import { log } from "@graphprotocol/graph-ts";
import { USDTExchangeList } from "./pb/sf/substreams/cosmos/v1/USDTExchangeList";
import { USDTExchangeVolume } from "../generated/schema";
import { Protobuf } from 'as-proto/assembly';
import { BigInt } from '@graphprotocol/graph-ts'

const ID = "one";

export function handleExchanges(bytes: Uint8Array): void {
    const usdtExchangeList: USDTExchangeList = Protobuf.decode<USDTExchangeList>(bytes, USDTExchangeList.decode);
    const exchanges = usdtExchangeList.exchanges;

    let entity = USDTExchangeVolume.load(ID);
    if (entity == null) {
        entity = new USDTExchangeVolume(ID);
        entity.amount = '0';
    }

    for (let i = 0; i < exchanges.length; i++) {
        const exchange = exchanges[i];
        const exchangeAmount = BigInt.fromString(exchange.amount);

        const entityAmount = BigInt.fromString(entity.amount);
        entityAmount.plus(exchangeAmount);

        entity.amount = entityAmount.toString();
        entity.save();
    }
}