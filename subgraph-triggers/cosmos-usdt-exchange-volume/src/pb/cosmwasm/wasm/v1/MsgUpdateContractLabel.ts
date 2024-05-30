// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class MsgUpdateContractLabel {
  static encode(message: MsgUpdateContractLabel, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.sender);

    writer.uint32(18);
    writer.string(message.newLabel);

    writer.uint32(26);
    writer.string(message.contract);
  }

  static decode(reader: Reader, length: i32): MsgUpdateContractLabel {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgUpdateContractLabel();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;

        case 2:
          message.newLabel = reader.string();
          break;

        case 3:
          message.contract = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  sender: string;
  newLabel: string;
  contract: string;

  constructor(
    sender: string = "",
    newLabel: string = "",
    contract: string = ""
  ) {
    this.sender = sender;
    this.newLabel = newLabel;
    this.contract = contract;
  }
}
