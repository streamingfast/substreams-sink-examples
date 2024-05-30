// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class MsgCreateSpotLimitOrderResponse {
  static encode(
    message: MsgCreateSpotLimitOrderResponse,
    writer: Writer
  ): void {
    writer.uint32(10);
    writer.string(message.orderHash);
  }

  static decode(reader: Reader, length: i32): MsgCreateSpotLimitOrderResponse {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgCreateSpotLimitOrderResponse();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderHash = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  orderHash: string;

  constructor(orderHash: string = "") {
    this.orderHash = orderHash;
  }
}
