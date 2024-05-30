// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class MsgSudoContract {
  static encode(message: MsgSudoContract, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.authority);

    writer.uint32(18);
    writer.string(message.contract);

    writer.uint32(26);
    writer.bytes(message.msg);
  }

  static decode(reader: Reader, length: i32): MsgSudoContract {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgSudoContract();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = reader.string();
          break;

        case 2:
          message.contract = reader.string();
          break;

        case 3:
          message.msg = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  authority: string;
  contract: string;
  msg: Uint8Array;

  constructor(
    authority: string = "",
    contract: string = "",
    msg: Uint8Array = new Uint8Array(0)
  ) {
    this.authority = authority;
    this.contract = contract;
    this.msg = msg;
  }
}
