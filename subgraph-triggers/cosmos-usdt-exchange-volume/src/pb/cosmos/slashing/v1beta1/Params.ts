// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { Duration } from "../../../google/protobuf/Duration";

export class Params {
  static encode(message: Params, writer: Writer): void {
    writer.uint32(8);
    writer.int64(message.signedBlocksWindow);

    writer.uint32(18);
    writer.bytes(message.minSignedPerWindow);

    const downtimeJailDuration = message.downtimeJailDuration;
    if (downtimeJailDuration !== null) {
      writer.uint32(26);
      writer.fork();
      Duration.encode(downtimeJailDuration, writer);
      writer.ldelim();
    }

    writer.uint32(34);
    writer.bytes(message.slashFractionDoubleSign);

    writer.uint32(42);
    writer.bytes(message.slashFractionDowntime);
  }

  static decode(reader: Reader, length: i32): Params {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new Params();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signedBlocksWindow = reader.int64();
          break;

        case 2:
          message.minSignedPerWindow = reader.bytes();
          break;

        case 3:
          message.downtimeJailDuration = Duration.decode(
            reader,
            reader.uint32()
          );
          break;

        case 4:
          message.slashFractionDoubleSign = reader.bytes();
          break;

        case 5:
          message.slashFractionDowntime = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  signedBlocksWindow: i64;
  minSignedPerWindow: Uint8Array;
  downtimeJailDuration: Duration | null;
  slashFractionDoubleSign: Uint8Array;
  slashFractionDowntime: Uint8Array;

  constructor(
    signedBlocksWindow: i64 = 0,
    minSignedPerWindow: Uint8Array = new Uint8Array(0),
    downtimeJailDuration: Duration | null = null,
    slashFractionDoubleSign: Uint8Array = new Uint8Array(0),
    slashFractionDowntime: Uint8Array = new Uint8Array(0)
  ) {
    this.signedBlocksWindow = signedBlocksWindow;
    this.minSignedPerWindow = minSignedPerWindow;
    this.downtimeJailDuration = downtimeJailDuration;
    this.slashFractionDoubleSign = slashFractionDoubleSign;
    this.slashFractionDowntime = slashFractionDowntime;
  }
}
