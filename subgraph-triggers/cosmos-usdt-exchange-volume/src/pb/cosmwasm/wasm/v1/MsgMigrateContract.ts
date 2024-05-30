// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class MsgMigrateContract {
  static encode(message: MsgMigrateContract, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.sender);

    writer.uint32(18);
    writer.string(message.contract);

    writer.uint32(24);
    writer.uint64(message.codeId);

    writer.uint32(34);
    writer.bytes(message.msg);
  }

  static decode(reader: Reader, length: i32): MsgMigrateContract {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgMigrateContract();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;

        case 2:
          message.contract = reader.string();
          break;

        case 3:
          message.codeId = reader.uint64();
          break;

        case 4:
          message.msg = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  sender: string;
  contract: string;
  codeId: u64;
  msg: Uint8Array;

  constructor(
    sender: string = "",
    contract: string = "",
    codeId: u64 = 0,
    msg: Uint8Array = new Uint8Array(0)
  ) {
    this.sender = sender;
    this.contract = contract;
    this.codeId = codeId;
    this.msg = msg;
  }
}
