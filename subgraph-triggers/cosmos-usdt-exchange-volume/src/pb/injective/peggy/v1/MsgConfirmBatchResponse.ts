// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class MsgConfirmBatchResponse {
  static encode(message: MsgConfirmBatchResponse, writer: Writer): void {}

  static decode(reader: Reader, length: i32): MsgConfirmBatchResponse {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgConfirmBatchResponse();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  constructor() {}
}
