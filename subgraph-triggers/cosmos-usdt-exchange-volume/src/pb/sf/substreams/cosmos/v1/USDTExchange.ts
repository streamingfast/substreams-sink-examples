// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class USDTExchange {
  static encode(message: USDTExchange, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.amount);
  }

  static decode(reader: Reader, length: i32): USDTExchange {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new USDTExchange();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  amount: string;

  constructor(amount: string = "") {
    this.amount = amount;
  }
}
