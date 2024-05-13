import { log } from "@graphprotocol/graph-ts";
import { USDTExchangeList } from "./pb/sf/substreams/cosmos/v1/USDTExchangeList";
import { USDTExchangeVolume } from "../generated/schema";
import { Protobuf } from 'as-proto/assembly';

const ID = "one";

export function handleExchanges(bytes: Uint8Array): void {
    const usdtExchangeList: USDTExchangeList = Protobuf.decode<USDTExchangeList>(bytes, USDTExchangeList.decode);
    const exchanges = usdtExchangeList.exchanges;

    if (exchanges.length == 0) {
        return;
    }

    let entity = USDTExchangeVolume.load(ID);
    if (entity == null) {
        entity = new USDTExchangeVolume(ID);
        entity.amount = 0;
    }

    for (let i = 0; i < exchanges.length; i++) {
        let exchange = exchanges[i];
        entity.amount += exchange.amount;
        entity.save();
    }
}