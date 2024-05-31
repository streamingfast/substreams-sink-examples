// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { Clock } from "../../v1/Clock";
import { Event } from "./Event";

export class EventList {
  static encode(message: EventList, writer: Writer): void {
    const clock = message.clock;
    if (clock !== null) {
      writer.uint32(10);
      writer.fork();
      Clock.encode(clock, writer);
      writer.ldelim();
    }

    const events = message.events;
    for (let i: i32 = 0; i < events.length; ++i) {
      writer.uint32(18);
      writer.fork();
      Event.encode(events[i], writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): EventList {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new EventList();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clock = Clock.decode(reader, reader.uint32());
          break;

        case 2:
          message.events.push(Event.decode(reader, reader.uint32()));
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  clock: Clock | null;
  events: Array<Event>;

  constructor(clock: Clock | null = null, events: Array<Event> = []) {
    this.clock = clock;
    this.events = events;
  }
}