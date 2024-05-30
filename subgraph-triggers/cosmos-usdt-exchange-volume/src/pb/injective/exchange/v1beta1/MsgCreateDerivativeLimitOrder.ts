// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { DerivativeOrder } from "./DerivativeOrder";

export class MsgCreateDerivativeLimitOrder {
  static encode(message: MsgCreateDerivativeLimitOrder, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.sender);

    const order = message.order;
    if (order !== null) {
      writer.uint32(18);
      writer.fork();
      DerivativeOrder.encode(order, writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): MsgCreateDerivativeLimitOrder {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgCreateDerivativeLimitOrder();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;

        case 2:
          message.order = DerivativeOrder.decode(reader, reader.uint32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  sender: string;
  order: DerivativeOrder | null;

  constructor(sender: string = "", order: DerivativeOrder | null = null) {
    this.sender = sender;
    this.order = order;
  }
}
