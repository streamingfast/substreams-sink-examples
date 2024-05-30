// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { Coin } from "../../base/v1beta1/Coin";

export class MsgDeposit {
  static encode(message: MsgDeposit, writer: Writer): void {
    writer.uint32(8);
    writer.uint64(message.proposalId);

    writer.uint32(18);
    writer.string(message.depositor);

    const amount = message.amount;
    for (let i: i32 = 0; i < amount.length; ++i) {
      writer.uint32(26);
      writer.fork();
      Coin.encode(amount[i], writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): MsgDeposit {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgDeposit();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.proposalId = reader.uint64();
          break;

        case 2:
          message.depositor = reader.string();
          break;

        case 3:
          message.amount.push(Coin.decode(reader, reader.uint32()));
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  proposalId: u64;
  depositor: string;
  amount: Array<Coin>;

  constructor(
    proposalId: u64 = 0,
    depositor: string = "",
    amount: Array<Coin> = []
  ) {
    this.proposalId = proposalId;
    this.depositor = depositor;
    this.amount = amount;
  }
}
