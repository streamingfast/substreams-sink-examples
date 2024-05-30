// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class MsgConfirmBatch {
  static encode(message: MsgConfirmBatch, writer: Writer): void {
    writer.uint32(8);
    writer.uint64(message.nonce);

    writer.uint32(18);
    writer.string(message.tokenContract);

    writer.uint32(26);
    writer.string(message.ethSigner);

    writer.uint32(34);
    writer.string(message.orchestrator);

    writer.uint32(42);
    writer.string(message.signature);
  }

  static decode(reader: Reader, length: i32): MsgConfirmBatch {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgConfirmBatch();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nonce = reader.uint64();
          break;

        case 2:
          message.tokenContract = reader.string();
          break;

        case 3:
          message.ethSigner = reader.string();
          break;

        case 4:
          message.orchestrator = reader.string();
          break;

        case 5:
          message.signature = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  nonce: u64;
  tokenContract: string;
  ethSigner: string;
  orchestrator: string;
  signature: string;

  constructor(
    nonce: u64 = 0,
    tokenContract: string = "",
    ethSigner: string = "",
    orchestrator: string = "",
    signature: string = ""
  ) {
    this.nonce = nonce;
    this.tokenContract = tokenContract;
    this.ethSigner = ethSigner;
    this.orchestrator = orchestrator;
    this.signature = signature;
  }
}
