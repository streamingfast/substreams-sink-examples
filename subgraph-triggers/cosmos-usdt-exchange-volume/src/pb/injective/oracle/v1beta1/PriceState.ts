// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class PriceState {
  static encode(message: PriceState, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.price);

    writer.uint32(18);
    writer.string(message.cumulativePrice);

    writer.uint32(24);
    writer.int64(message.timestamp);
  }

  static decode(reader: Reader, length: i32): PriceState {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new PriceState();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.price = reader.string();
          break;

        case 2:
          message.cumulativePrice = reader.string();
          break;

        case 3:
          message.timestamp = reader.int64();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  price: string;
  cumulativePrice: string;
  timestamp: i64;

  constructor(
    price: string = "",
    cumulativePrice: string = "",
    timestamp: i64 = 0
  ) {
    this.price = price;
    this.cumulativePrice = cumulativePrice;
    this.timestamp = timestamp;
  }
}
