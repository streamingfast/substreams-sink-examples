// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { PositionDelta } from "./PositionDelta";

export class DerivativeTradeLog {
  static encode(message: DerivativeTradeLog, writer: Writer): void {
    writer.uint32(10);
    writer.bytes(message.subaccountId);

    const positionDelta = message.positionDelta;
    if (positionDelta !== null) {
      writer.uint32(18);
      writer.fork();
      PositionDelta.encode(positionDelta, writer);
      writer.ldelim();
    }

    writer.uint32(26);
    writer.string(message.payout);

    writer.uint32(34);
    writer.string(message.fee);

    writer.uint32(42);
    writer.bytes(message.orderHash);

    writer.uint32(50);
    writer.bytes(message.feeRecipientAddress);

    writer.uint32(58);
    writer.string(message.cid);
  }

  static decode(reader: Reader, length: i32): DerivativeTradeLog {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new DerivativeTradeLog();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subaccountId = reader.bytes();
          break;

        case 2:
          message.positionDelta = PositionDelta.decode(reader, reader.uint32());
          break;

        case 3:
          message.payout = reader.string();
          break;

        case 4:
          message.fee = reader.string();
          break;

        case 5:
          message.orderHash = reader.bytes();
          break;

        case 6:
          message.feeRecipientAddress = reader.bytes();
          break;

        case 7:
          message.cid = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  subaccountId: Uint8Array;
  positionDelta: PositionDelta | null;
  payout: string;
  fee: string;
  orderHash: Uint8Array;
  feeRecipientAddress: Uint8Array;
  cid: string;

  constructor(
    subaccountId: Uint8Array = new Uint8Array(0),
    positionDelta: PositionDelta | null = null,
    payout: string = "",
    fee: string = "",
    orderHash: Uint8Array = new Uint8Array(0),
    feeRecipientAddress: Uint8Array = new Uint8Array(0),
    cid: string = ""
  ) {
    this.subaccountId = subaccountId;
    this.positionDelta = positionDelta;
    this.payout = payout;
    this.fee = fee;
    this.orderHash = orderHash;
    this.feeRecipientAddress = feeRecipientAddress;
    this.cid = cid;
  }
}
