// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { OracleType } from "./OracleType";

export class SymbolPriceTimestamp {
  static encode(message: SymbolPriceTimestamp, writer: Writer): void {
    writer.uint32(8);
    writer.int32(message.oracle);

    writer.uint32(18);
    writer.string(message.symbolId);

    writer.uint32(24);
    writer.int64(message.timestamp);
  }

  static decode(reader: Reader, length: i32): SymbolPriceTimestamp {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new SymbolPriceTimestamp();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.oracle = reader.int32();
          break;

        case 2:
          message.symbolId = reader.string();
          break;

        case 3:
          message.timestamp = reader.int64();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  oracle: OracleType;
  symbolId: string;
  timestamp: i64;

  constructor(
    oracle: OracleType = 0,
    symbolId: string = "",
    timestamp: i64 = 0
  ) {
    this.oracle = oracle;
    this.symbolId = symbolId;
    this.timestamp = timestamp;
  }
}
