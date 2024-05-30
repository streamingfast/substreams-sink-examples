// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class PinCodesProposal {
  static encode(message: PinCodesProposal, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.title);

    writer.uint32(18);
    writer.string(message.description);

    const codeIds = message.codeIds;
    if (codeIds.length !== 0) {
      for (let i: i32 = 0; i < codeIds.length; ++i) {
        writer.uint32(24);
        writer.uint64(codeIds[i]);
      }
    }
  }

  static decode(reader: Reader, length: i32): PinCodesProposal {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new PinCodesProposal();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;

        case 2:
          message.description = reader.string();
          break;

        case 3:
          message.codeIds.push(reader.uint64());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  title: string;
  description: string;
  codeIds: Array<u64>;

  constructor(
    title: string = "",
    description: string = "",
    codeIds: Array<u64> = []
  ) {
    this.title = title;
    this.description = description;
    this.codeIds = codeIds;
  }
}
