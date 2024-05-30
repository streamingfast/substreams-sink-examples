// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { PartSetHeader } from "./PartSetHeader";

export class BlockID {
  static encode(message: BlockID, writer: Writer): void {
    writer.uint32(10);
    writer.bytes(message.hash);

    const partSetHeader = message.partSetHeader;
    if (partSetHeader !== null) {
      writer.uint32(18);
      writer.fork();
      PartSetHeader.encode(partSetHeader, writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): BlockID {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new BlockID();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.hash = reader.bytes();
          break;

        case 2:
          message.partSetHeader = PartSetHeader.decode(reader, reader.uint32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  hash: Uint8Array;
  partSetHeader: PartSetHeader | null;

  constructor(
    hash: Uint8Array = new Uint8Array(0),
    partSetHeader: PartSetHeader | null = null
  ) {
    this.hash = hash;
    this.partSetHeader = partSetHeader;
  }
}
