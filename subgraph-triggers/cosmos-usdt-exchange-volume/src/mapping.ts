import { log } from "@graphprotocol/graph-ts";
import { EventList } from "./pb/sf/substreams/cosmos/v1/EventList";
import { USDTExchangeVolume } from "../generated/schema";
import { Protobuf } from 'as-proto/assembly';
import { BigInt } from '@graphprotocol/graph-ts'

const USDT_addr = "peggy0xdAC17F958D2ee523a2206206994597C13D831ec7";
const DOJO_addr = "inj1h0mpv48ctcsmydymh2hnkal7hla5gl4gftemqv";
const ID = "one";

export function handleEvents(bytes: Uint8Array): void {
    const eventList: EventList = Protobuf.decode<EventList>(bytes, EventList.decode);
    const events = eventList.events;

    log.info("Protobuf decoded, length: {}", [events.length.toString()]);

    let entity = USDTExchangeVolume.load(ID);
    if (entity == null) {
        log.info("Entity not found, creating one...", []);
        entity = new USDTExchangeVolume(ID);
        entity.amount = '0';
    }

    for (let i = 0; i < events.length; i++) {
        const event = events[i].event;
        if (event == null || event.type != "wasm") { // should be filtered by substreams
            continue;
        }

        let contract_addr = "";
        let action = "";
        let ask_asset = "";
        let ask_amount = "";
        let offer_asset = "";
        let offer_amount = "";

        for (let i = 0; i < event.attributes.length; ++i) {
            const attr = event.attributes[i];
            if (attr.key == '_contract_addr') {
                    contract_addr = attr.value;
            } else if (attr.key == '_action') {
                    action = attr.value;
            } else if (attr.key == 'ask_asset') {
                    ask_asset = attr.value;
            } else if (attr.key == 'ask_amount' || attr.key == 'return_amount') {
                    ask_amount = attr.value;
            } else if (attr.key == 'offer_asset') {
                    offer_asset = attr.value;
            } else if (attr.key == 'offer_amount') {
                    offer_amount = attr.value;
            }
        }
        if (contract_addr != DOJO_addr) {
            continue;
        }

        let exchangeAmountStr = "";

        if (ask_asset == USDT_addr && ask_amount != "") {
            exchangeAmountStr = ask_amount;
        } 
        if (offer_asset == USDT_addr && offer_amount != "") {
            exchangeAmountStr = ask_amount;
        }
        if (exchangeAmountStr == "") {
            continue;
        }

        const exchangeAmount = BigInt.fromString(exchangeAmountStr);
        const entityAmount = BigInt.fromString(entity.amount);
        const sumResult = entityAmount.plus(exchangeAmount);
        entity.amount = sumResult.toString();
        entity.save();
        log.debug("Entity saved: {}", [entity.amount]);
    }
}