// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class OrderData {
  static encode(message: OrderData, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.marketId);

    writer.uint32(18);
    writer.string(message.subaccountId);

    writer.uint32(26);
    writer.string(message.orderHash);

    writer.uint32(32);
    writer.int32(message.orderMask);

    writer.uint32(42);
    writer.string(message.cid);
  }

  static decode(reader: Reader, length: i32): OrderData {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new OrderData();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.marketId = reader.string();
          break;

        case 2:
          message.subaccountId = reader.string();
          break;

        case 3:
          message.orderHash = reader.string();
          break;

        case 4:
          message.orderMask = reader.int32();
          break;

        case 5:
          message.cid = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  marketId: string;
  subaccountId: string;
  orderHash: string;
  orderMask: i32;
  cid: string;

  constructor(
    marketId: string = "",
    subaccountId: string = "",
    orderHash: string = "",
    orderMask: i32 = 0,
    cid: string = ""
  ) {
    this.marketId = marketId;
    this.subaccountId = subaccountId;
    this.orderHash = orderHash;
    this.orderMask = orderMask;
    this.cid = cid;
  }
}
