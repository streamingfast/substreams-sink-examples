// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { Coin } from "../../base/v1beta1/Coin";

export class Supply {
  static encode(message: Supply, writer: Writer): void {
    const total = message.total;
    for (let i: i32 = 0; i < total.length; ++i) {
      writer.uint32(10);
      writer.fork();
      Coin.encode(total[i], writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): Supply {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new Supply();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.total.push(Coin.decode(reader, reader.uint32()));
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  total: Array<Coin>;

  constructor(total: Array<Coin> = []) {
    this.total = total;
  }
}
