// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class MsgReclaimLockedFunds {
  static encode(message: MsgReclaimLockedFunds, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.sender);

    writer.uint32(18);
    writer.bytes(message.lockedAccountPubKey);

    writer.uint32(26);
    writer.bytes(message.signature);
  }

  static decode(reader: Reader, length: i32): MsgReclaimLockedFunds {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgReclaimLockedFunds();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;

        case 2:
          message.lockedAccountPubKey = reader.bytes();
          break;

        case 3:
          message.signature = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  sender: string;
  lockedAccountPubKey: Uint8Array;
  signature: Uint8Array;

  constructor(
    sender: string = "",
    lockedAccountPubKey: Uint8Array = new Uint8Array(0),
    signature: Uint8Array = new Uint8Array(0)
  ) {
    this.sender = sender;
    this.lockedAccountPubKey = lockedAccountPubKey;
    this.signature = signature;
  }
}
