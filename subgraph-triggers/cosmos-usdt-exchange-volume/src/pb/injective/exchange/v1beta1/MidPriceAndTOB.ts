// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class MidPriceAndTOB {
  static encode(message: MidPriceAndTOB, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.midPrice);

    writer.uint32(18);
    writer.string(message.bestBuyPrice);

    writer.uint32(26);
    writer.string(message.bestSellPrice);
  }

  static decode(reader: Reader, length: i32): MidPriceAndTOB {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MidPriceAndTOB();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.midPrice = reader.string();
          break;

        case 2:
          message.bestBuyPrice = reader.string();
          break;

        case 3:
          message.bestSellPrice = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  midPrice: string;
  bestBuyPrice: string;
  bestSellPrice: string;

  constructor(
    midPrice: string = "",
    bestBuyPrice: string = "",
    bestSellPrice: string = ""
  ) {
    this.midPrice = midPrice;
    this.bestBuyPrice = bestBuyPrice;
    this.bestSellPrice = bestSellPrice;
  }
}
