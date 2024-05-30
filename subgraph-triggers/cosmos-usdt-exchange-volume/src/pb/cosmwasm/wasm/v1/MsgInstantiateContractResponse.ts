// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class MsgInstantiateContractResponse {
  static encode(message: MsgInstantiateContractResponse, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.address);

    writer.uint32(18);
    writer.bytes(message.data);
  }

  static decode(reader: Reader, length: i32): MsgInstantiateContractResponse {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgInstantiateContractResponse();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;

        case 2:
          message.data = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  address: string;
  data: Uint8Array;

  constructor(address: string = "", data: Uint8Array = new Uint8Array(0)) {
    this.address = address;
    this.data = data;
  }
}
