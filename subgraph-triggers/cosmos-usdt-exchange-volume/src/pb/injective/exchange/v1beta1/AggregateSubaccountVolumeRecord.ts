// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { MarketVolume } from "./MarketVolume";

export class AggregateSubaccountVolumeRecord {
  static encode(
    message: AggregateSubaccountVolumeRecord,
    writer: Writer
  ): void {
    writer.uint32(10);
    writer.string(message.subaccountId);

    const marketVolumes = message.marketVolumes;
    for (let i: i32 = 0; i < marketVolumes.length; ++i) {
      writer.uint32(18);
      writer.fork();
      MarketVolume.encode(marketVolumes[i], writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): AggregateSubaccountVolumeRecord {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new AggregateSubaccountVolumeRecord();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subaccountId = reader.string();
          break;

        case 2:
          message.marketVolumes.push(
            MarketVolume.decode(reader, reader.uint32())
          );
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  subaccountId: string;
  marketVolumes: Array<MarketVolume>;

  constructor(
    subaccountId: string = "",
    marketVolumes: Array<MarketVolume> = []
  ) {
    this.subaccountId = subaccountId;
    this.marketVolumes = marketVolumes;
  }
}
