// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { Event as Event_2 } from "../../../cosmos/type/v2/Event";

export class Event {
  static encode(message: Event, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.transactionHash);

    const event = message.event;
    if (event !== null) {
      writer.uint32(18);
      writer.fork();
      Event_2.encode(event, writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): Event {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new Event();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.transactionHash = reader.string();
          break;

        case 2:
          message.event = Event_2.decode(reader, reader.uint32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  transactionHash: string;
  event: Event_2 | null;

  constructor(transactionHash: string = "", event: Event_2 | null = null) {
    this.transactionHash = transactionHash;
    this.event = event;
  }
}