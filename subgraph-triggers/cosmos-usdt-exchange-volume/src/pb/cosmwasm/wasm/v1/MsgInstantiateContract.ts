// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { Coin } from "../../../cosmos/base/v1beta1/Coin";

export class MsgInstantiateContract {
  static encode(message: MsgInstantiateContract, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.sender);

    writer.uint32(18);
    writer.string(message.admin);

    writer.uint32(24);
    writer.uint64(message.codeId);

    writer.uint32(34);
    writer.string(message.label);

    writer.uint32(42);
    writer.bytes(message.msg);

    const funds = message.funds;
    for (let i: i32 = 0; i < funds.length; ++i) {
      writer.uint32(50);
      writer.fork();
      Coin.encode(funds[i], writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): MsgInstantiateContract {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgInstantiateContract();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;

        case 2:
          message.admin = reader.string();
          break;

        case 3:
          message.codeId = reader.uint64();
          break;

        case 4:
          message.label = reader.string();
          break;

        case 5:
          message.msg = reader.bytes();
          break;

        case 6:
          message.funds.push(Coin.decode(reader, reader.uint32()));
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  sender: string;
  admin: string;
  codeId: u64;
  label: string;
  msg: Uint8Array;
  funds: Array<Coin>;

  constructor(
    sender: string = "",
    admin: string = "",
    codeId: u64 = 0,
    label: string = "",
    msg: Uint8Array = new Uint8Array(0),
    funds: Array<Coin> = []
  ) {
    this.sender = sender;
    this.admin = admin;
    this.codeId = codeId;
    this.label = label;
    this.msg = msg;
    this.funds = funds;
  }
}
