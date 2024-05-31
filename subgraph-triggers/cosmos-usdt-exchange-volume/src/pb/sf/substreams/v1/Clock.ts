// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { Timestamp } from "../../../google/protobuf/Timestamp";

export class Clock {
  static encode(message: Clock, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.id);

    writer.uint32(16);
    writer.uint64(message.number);

    const timestamp = message.timestamp;
    if (timestamp !== null) {
      writer.uint32(26);
      writer.fork();
      Timestamp.encode(timestamp, writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): Clock {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new Clock();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;

        case 2:
          message.number = reader.uint64();
          break;

        case 3:
          message.timestamp = Timestamp.decode(reader, reader.uint32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  id: string;
  number: u64;
  timestamp: Timestamp | null;

  constructor(
    id: string = "",
    number: u64 = 0,
    timestamp: Timestamp | null = null
  ) {
    this.id = id;
    this.number = number;
    this.timestamp = timestamp;
  }
}
