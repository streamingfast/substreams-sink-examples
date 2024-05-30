// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { PriceState } from "./PriceState";

export class ProviderPriceState {
  static encode(message: ProviderPriceState, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.symbol);

    const state = message.state;
    if (state !== null) {
      writer.uint32(18);
      writer.fork();
      PriceState.encode(state, writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): ProviderPriceState {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new ProviderPriceState();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.symbol = reader.string();
          break;

        case 2:
          message.state = PriceState.decode(reader, reader.uint32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  symbol: string;
  state: PriceState | null;

  constructor(symbol: string = "", state: PriceState | null = null) {
    this.symbol = symbol;
    this.state = state;
  }
}
