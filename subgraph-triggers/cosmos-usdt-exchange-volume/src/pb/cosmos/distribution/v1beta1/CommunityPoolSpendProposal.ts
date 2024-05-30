// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { Coin } from "../../base/v1beta1/Coin";

export class CommunityPoolSpendProposal {
  static encode(message: CommunityPoolSpendProposal, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.title);

    writer.uint32(18);
    writer.string(message.description);

    writer.uint32(26);
    writer.string(message.recipient);

    const amount = message.amount;
    for (let i: i32 = 0; i < amount.length; ++i) {
      writer.uint32(34);
      writer.fork();
      Coin.encode(amount[i], writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): CommunityPoolSpendProposal {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new CommunityPoolSpendProposal();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;

        case 2:
          message.description = reader.string();
          break;

        case 3:
          message.recipient = reader.string();
          break;

        case 4:
          message.amount.push(Coin.decode(reader, reader.uint32()));
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  title: string;
  description: string;
  recipient: string;
  amount: Array<Coin>;

  constructor(
    title: string = "",
    description: string = "",
    recipient: string = "",
    amount: Array<Coin> = []
  ) {
    this.title = title;
    this.description = description;
    this.recipient = recipient;
    this.amount = amount;
  }
}
