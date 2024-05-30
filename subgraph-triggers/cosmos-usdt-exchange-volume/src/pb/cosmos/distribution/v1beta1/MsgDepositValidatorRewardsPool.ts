// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { Coin } from "../../base/v1beta1/Coin";

export class MsgDepositValidatorRewardsPool {
  static encode(message: MsgDepositValidatorRewardsPool, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.depositor);

    writer.uint32(18);
    writer.string(message.validatorAddress);

    const amount = message.amount;
    for (let i: i32 = 0; i < amount.length; ++i) {
      writer.uint32(26);
      writer.fork();
      Coin.encode(amount[i], writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): MsgDepositValidatorRewardsPool {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgDepositValidatorRewardsPool();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.depositor = reader.string();
          break;

        case 2:
          message.validatorAddress = reader.string();
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

  depositor: string;
  validatorAddress: string;
  amount: Array<Coin>;

  constructor(
    depositor: string = "",
    validatorAddress: string = "",
    amount: Array<Coin> = []
  ) {
    this.depositor = depositor;
    this.validatorAddress = validatorAddress;
    this.amount = amount;
  }
}
