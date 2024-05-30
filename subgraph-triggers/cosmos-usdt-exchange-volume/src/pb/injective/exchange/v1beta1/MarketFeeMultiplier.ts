// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class MarketFeeMultiplier {
  static encode(message: MarketFeeMultiplier, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.marketId);

    writer.uint32(18);
    writer.string(message.feeMultiplier);
  }

  static decode(reader: Reader, length: i32): MarketFeeMultiplier {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MarketFeeMultiplier();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.marketId = reader.string();
          break;

        case 2:
          message.feeMultiplier = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  marketId: string;
  feeMultiplier: string;

  constructor(marketId: string = "", feeMultiplier: string = "") {
    this.marketId = marketId;
    this.feeMultiplier = feeMultiplier;
  }
}
