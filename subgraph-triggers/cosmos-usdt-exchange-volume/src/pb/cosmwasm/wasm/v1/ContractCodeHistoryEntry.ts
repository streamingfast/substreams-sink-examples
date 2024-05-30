// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { AbsoluteTxPosition } from "./AbsoluteTxPosition";
import { ContractCodeHistoryOperationType } from "./ContractCodeHistoryOperationType";

export class ContractCodeHistoryEntry {
  static encode(message: ContractCodeHistoryEntry, writer: Writer): void {
    writer.uint32(8);
    writer.int32(message.operation);

    writer.uint32(16);
    writer.uint64(message.codeId);

    const updated = message.updated;
    if (updated !== null) {
      writer.uint32(26);
      writer.fork();
      AbsoluteTxPosition.encode(updated, writer);
      writer.ldelim();
    }

    writer.uint32(34);
    writer.bytes(message.msg);
  }

  static decode(reader: Reader, length: i32): ContractCodeHistoryEntry {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new ContractCodeHistoryEntry();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.operation = reader.int32();
          break;

        case 2:
          message.codeId = reader.uint64();
          break;

        case 3:
          message.updated = AbsoluteTxPosition.decode(reader, reader.uint32());
          break;

        case 4:
          message.msg = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  operation: ContractCodeHistoryOperationType;
  codeId: u64;
  updated: AbsoluteTxPosition | null;
  msg: Uint8Array;

  constructor(
    operation: ContractCodeHistoryOperationType = 0,
    codeId: u64 = 0,
    updated: AbsoluteTxPosition | null = null,
    msg: Uint8Array = new Uint8Array(0)
  ) {
    this.operation = operation;
    this.codeId = codeId;
    this.updated = updated;
    this.msg = msg;
  }
}
