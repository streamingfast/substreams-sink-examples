// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { SubaccountOrder } from "./SubaccountOrder";

export class SubaccountOrderData {
  static encode(message: SubaccountOrderData, writer: Writer): void {
    const order = message.order;
    if (order !== null) {
      writer.uint32(10);
      writer.fork();
      SubaccountOrder.encode(order, writer);
      writer.ldelim();
    }

    writer.uint32(18);
    writer.bytes(message.orderHash);
  }

  static decode(reader: Reader, length: i32): SubaccountOrderData {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new SubaccountOrderData();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.order = SubaccountOrder.decode(reader, reader.uint32());
          break;

        case 2:
          message.orderHash = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  order: SubaccountOrder | null;
  orderHash: Uint8Array;

  constructor(
    order: SubaccountOrder | null = null,
    orderHash: Uint8Array = new Uint8Array(0)
  ) {
    this.order = order;
    this.orderHash = orderHash;
  }
}
