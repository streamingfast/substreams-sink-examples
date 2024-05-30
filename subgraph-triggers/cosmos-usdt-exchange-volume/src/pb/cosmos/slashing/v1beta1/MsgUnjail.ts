// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class MsgUnjail {
  static encode(message: MsgUnjail, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.validatorAddr);
  }

  static decode(reader: Reader, length: i32): MsgUnjail {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgUnjail();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorAddr = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  validatorAddr: string;

  constructor(validatorAddr: string = "") {
    this.validatorAddr = validatorAddr;
  }
}
