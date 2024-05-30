// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { SpotMarketOrderResults } from "./SpotMarketOrderResults";

export class MsgCreateSpotMarketOrderResponse {
  static encode(
    message: MsgCreateSpotMarketOrderResponse,
    writer: Writer
  ): void {
    writer.uint32(10);
    writer.string(message.orderHash);

    const results = message.results;
    if (results !== null) {
      writer.uint32(18);
      writer.fork();
      SpotMarketOrderResults.encode(results, writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): MsgCreateSpotMarketOrderResponse {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgCreateSpotMarketOrderResponse();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderHash = reader.string();
          break;

        case 2:
          message.results = SpotMarketOrderResults.decode(
            reader,
            reader.uint32()
          );
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  orderHash: string;
  results: SpotMarketOrderResults | null;

  constructor(
    orderHash: string = "",
    results: SpotMarketOrderResults | null = null
  ) {
    this.orderHash = orderHash;
    this.results = results;
  }
}
