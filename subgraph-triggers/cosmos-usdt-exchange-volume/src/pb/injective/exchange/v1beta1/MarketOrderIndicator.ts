// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class MarketOrderIndicator {
  static encode(message: MarketOrderIndicator, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.marketId);

    writer.uint32(16);
    writer.bool(message.isBuy);
  }

  static decode(reader: Reader, length: i32): MarketOrderIndicator {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MarketOrderIndicator();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.marketId = reader.string();
          break;

        case 2:
          message.isBuy = reader.bool();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  marketId: string;
  isBuy: bool;

  constructor(marketId: string = "", isBuy: bool = false) {
    this.marketId = marketId;
    this.isBuy = isBuy;
  }
}
