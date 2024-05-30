// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class VolumeRecord {
  static encode(message: VolumeRecord, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.makerVolume);

    writer.uint32(18);
    writer.string(message.takerVolume);
  }

  static decode(reader: Reader, length: i32): VolumeRecord {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new VolumeRecord();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.makerVolume = reader.string();
          break;

        case 2:
          message.takerVolume = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  makerVolume: string;
  takerVolume: string;

  constructor(makerVolume: string = "", takerVolume: string = "") {
    this.makerVolume = makerVolume;
    this.takerVolume = takerVolume;
  }
}
