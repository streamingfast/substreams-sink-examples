// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { MarketStatus } from "./MarketStatus";

export class SpotMarket {
  static encode(message: SpotMarket, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.ticker);

    writer.uint32(18);
    writer.string(message.baseDenom);

    writer.uint32(26);
    writer.string(message.quoteDenom);

    writer.uint32(34);
    writer.string(message.makerFeeRate);

    writer.uint32(42);
    writer.string(message.takerFeeRate);

    writer.uint32(50);
    writer.string(message.relayerFeeShareRate);

    writer.uint32(58);
    writer.string(message.marketId);

    writer.uint32(64);
    writer.int32(message.status);

    writer.uint32(74);
    writer.string(message.minPriceTickSize);

    writer.uint32(82);
    writer.string(message.minQuantityTickSize);
  }

  static decode(reader: Reader, length: i32): SpotMarket {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new SpotMarket();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ticker = reader.string();
          break;

        case 2:
          message.baseDenom = reader.string();
          break;

        case 3:
          message.quoteDenom = reader.string();
          break;

        case 4:
          message.makerFeeRate = reader.string();
          break;

        case 5:
          message.takerFeeRate = reader.string();
          break;

        case 6:
          message.relayerFeeShareRate = reader.string();
          break;

        case 7:
          message.marketId = reader.string();
          break;

        case 8:
          message.status = reader.int32();
          break;

        case 9:
          message.minPriceTickSize = reader.string();
          break;

        case 10:
          message.minQuantityTickSize = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  ticker: string;
  baseDenom: string;
  quoteDenom: string;
  makerFeeRate: string;
  takerFeeRate: string;
  relayerFeeShareRate: string;
  marketId: string;
  status: MarketStatus;
  minPriceTickSize: string;
  minQuantityTickSize: string;

  constructor(
    ticker: string = "",
    baseDenom: string = "",
    quoteDenom: string = "",
    makerFeeRate: string = "",
    takerFeeRate: string = "",
    relayerFeeShareRate: string = "",
    marketId: string = "",
    status: MarketStatus = 0,
    minPriceTickSize: string = "",
    minQuantityTickSize: string = ""
  ) {
    this.ticker = ticker;
    this.baseDenom = baseDenom;
    this.quoteDenom = quoteDenom;
    this.makerFeeRate = makerFeeRate;
    this.takerFeeRate = takerFeeRate;
    this.relayerFeeShareRate = relayerFeeShareRate;
    this.marketId = marketId;
    this.status = status;
    this.minPriceTickSize = minPriceTickSize;
    this.minQuantityTickSize = minQuantityTickSize;
  }
}
