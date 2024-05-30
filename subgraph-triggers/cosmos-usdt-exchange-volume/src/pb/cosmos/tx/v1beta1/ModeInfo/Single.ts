// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { SignMode } from "../../signing/v1beta1/SignMode";

export class Single {
  static encode(message: Single, writer: Writer): void {
    writer.uint32(8);
    writer.int32(message.mode);
  }

  static decode(reader: Reader, length: i32): Single {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new Single();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.mode = reader.int32();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  mode: SignMode;

  constructor(mode: SignMode = 0) {
    this.mode = mode;
  }
}
