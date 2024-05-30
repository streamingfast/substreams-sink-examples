// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class MsgRevoke {
  static encode(message: MsgRevoke, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.granter);

    writer.uint32(18);
    writer.string(message.grantee);

    writer.uint32(26);
    writer.string(message.msgTypeUrl);
  }

  static decode(reader: Reader, length: i32): MsgRevoke {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgRevoke();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.granter = reader.string();
          break;

        case 2:
          message.grantee = reader.string();
          break;

        case 3:
          message.msgTypeUrl = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  granter: string;
  grantee: string;
  msgTypeUrl: string;

  constructor(
    granter: string = "",
    grantee: string = "",
    msgTypeUrl: string = ""
  ) {
    this.granter = granter;
    this.grantee = grantee;
    this.msgTypeUrl = msgTypeUrl;
  }
}
