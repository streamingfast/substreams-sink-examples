// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { PositionDelta } from "./PositionDelta";

export class DerivativeMarketOrderResults {
  static encode(message: DerivativeMarketOrderResults, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.quantity);

    writer.uint32(18);
    writer.string(message.price);

    writer.uint32(26);
    writer.string(message.fee);

    const positionDelta = message.positionDelta;
    if (positionDelta !== null) {
      writer.uint32(34);
      writer.fork();
      PositionDelta.encode(positionDelta, writer);
      writer.ldelim();
    }

    writer.uint32(42);
    writer.string(message.payout);
  }

  static decode(reader: Reader, length: i32): DerivativeMarketOrderResults {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new DerivativeMarketOrderResults();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.quantity = reader.string();
          break;

        case 2:
          message.price = reader.string();
          break;

        case 3:
          message.fee = reader.string();
          break;

        case 4:
          message.positionDelta = PositionDelta.decode(reader, reader.uint32());
          break;

        case 5:
          message.payout = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  quantity: string;
  price: string;
  fee: string;
  positionDelta: PositionDelta | null;
  payout: string;

  constructor(
    quantity: string = "",
    price: string = "",
    fee: string = "",
    positionDelta: PositionDelta | null = null,
    payout: string = ""
  ) {
    this.quantity = quantity;
    this.price = price;
    this.fee = fee;
    this.positionDelta = positionDelta;
    this.payout = payout;
  }
}
