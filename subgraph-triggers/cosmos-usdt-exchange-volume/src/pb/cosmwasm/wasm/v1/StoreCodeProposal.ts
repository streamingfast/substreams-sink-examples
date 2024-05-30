// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { AccessConfig } from "./AccessConfig";

export class StoreCodeProposal {
  static encode(message: StoreCodeProposal, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.title);

    writer.uint32(18);
    writer.string(message.description);

    writer.uint32(26);
    writer.string(message.runAs);

    writer.uint32(34);
    writer.bytes(message.wasmByteCode);

    const instantiatePermission = message.instantiatePermission;
    if (instantiatePermission !== null) {
      writer.uint32(58);
      writer.fork();
      AccessConfig.encode(instantiatePermission, writer);
      writer.ldelim();
    }

    writer.uint32(64);
    writer.bool(message.unpinCode);

    writer.uint32(74);
    writer.string(message.source);

    writer.uint32(82);
    writer.string(message.builder);

    writer.uint32(90);
    writer.bytes(message.codeHash);
  }

  static decode(reader: Reader, length: i32): StoreCodeProposal {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new StoreCodeProposal();

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
          message.runAs = reader.string();
          break;

        case 4:
          message.wasmByteCode = reader.bytes();
          break;

        case 7:
          message.instantiatePermission = AccessConfig.decode(
            reader,
            reader.uint32()
          );
          break;

        case 8:
          message.unpinCode = reader.bool();
          break;

        case 9:
          message.source = reader.string();
          break;

        case 10:
          message.builder = reader.string();
          break;

        case 11:
          message.codeHash = reader.bytes();
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
  runAs: string;
  wasmByteCode: Uint8Array;
  instantiatePermission: AccessConfig | null;
  unpinCode: bool;
  source: string;
  builder: string;
  codeHash: Uint8Array;

  constructor(
    title: string = "",
    description: string = "",
    runAs: string = "",
    wasmByteCode: Uint8Array = new Uint8Array(0),
    instantiatePermission: AccessConfig | null = null,
    unpinCode: bool = false,
    source: string = "",
    builder: string = "",
    codeHash: Uint8Array = new Uint8Array(0)
  ) {
    this.title = title;
    this.description = description;
    this.runAs = runAs;
    this.wasmByteCode = wasmByteCode;
    this.instantiatePermission = instantiatePermission;
    this.unpinCode = unpinCode;
    this.source = source;
    this.builder = builder;
    this.codeHash = codeHash;
  }
}
