// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { Semantic } from "./Annotation/Semantic";

export class Annotation {
  static encode(message: Annotation, writer: Writer): void {
    const path = message.path;
    if (path.length !== 0) {
      writer.uint32(10);
      writer.fork();
      for (let i: i32 = 0; i < path.length; ++i) {
        writer.int32(path[i]);
      }
      writer.ldelim();
    }

    writer.uint32(18);
    writer.string(message.sourceFile);

    writer.uint32(24);
    writer.int32(message.begin);

    writer.uint32(32);
    writer.int32(message.end);

    writer.uint32(40);
    writer.int32(message.semantic);
  }

  static decode(reader: Reader, length: i32): Annotation {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new Annotation();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          for (
            const end: usize = reader.ptr + reader.uint32();
            reader.ptr < end;

          ) {
            message.path.push(reader.int32());
          }
          break;

        case 2:
          message.sourceFile = reader.string();
          break;

        case 3:
          message.begin = reader.int32();
          break;

        case 4:
          message.end = reader.int32();
          break;

        case 5:
          message.semantic = reader.int32();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  path: Array<i32>;
  sourceFile: string;
  begin: i32;
  end: i32;
  semantic: Semantic;

  constructor(
    path: Array<i32> = [],
    sourceFile: string = "",
    begin: i32 = 0,
    end: i32 = 0,
    semantic: Semantic = 0
  ) {
    this.path = path;
    this.sourceFile = sourceFile;
    this.begin = begin;
    this.end = end;
    this.semantic = semantic;
  }
}
