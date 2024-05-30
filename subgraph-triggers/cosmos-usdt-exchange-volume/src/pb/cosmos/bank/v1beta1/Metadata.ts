// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { DenomUnit } from "./DenomUnit";

export class Metadata {
  static encode(message: Metadata, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.description);

    const denomUnits = message.denomUnits;
    for (let i: i32 = 0; i < denomUnits.length; ++i) {
      writer.uint32(18);
      writer.fork();
      DenomUnit.encode(denomUnits[i], writer);
      writer.ldelim();
    }

    writer.uint32(26);
    writer.string(message.base);

    writer.uint32(34);
    writer.string(message.display);

    writer.uint32(42);
    writer.string(message.name);

    writer.uint32(50);
    writer.string(message.symbol);

    writer.uint32(58);
    writer.string(message.uri);

    writer.uint32(66);
    writer.string(message.uriHash);
  }

  static decode(reader: Reader, length: i32): Metadata {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new Metadata();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.description = reader.string();
          break;

        case 2:
          message.denomUnits.push(DenomUnit.decode(reader, reader.uint32()));
          break;

        case 3:
          message.base = reader.string();
          break;

        case 4:
          message.display = reader.string();
          break;

        case 5:
          message.name = reader.string();
          break;

        case 6:
          message.symbol = reader.string();
          break;

        case 7:
          message.uri = reader.string();
          break;

        case 8:
          message.uriHash = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  description: string;
  denomUnits: Array<DenomUnit>;
  base: string;
  display: string;
  name: string;
  symbol: string;
  uri: string;
  uriHash: string;

  constructor(
    description: string = "",
    denomUnits: Array<DenomUnit> = [],
    base: string = "",
    display: string = "",
    name: string = "",
    symbol: string = "",
    uri: string = "",
    uriHash: string = ""
  ) {
    this.description = description;
    this.denomUnits = denomUnits;
    this.base = base;
    this.display = display;
    this.name = name;
    this.symbol = symbol;
    this.uri = uri;
    this.uriHash = uriHash;
  }
}
