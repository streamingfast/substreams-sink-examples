// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { UninterpretedOption } from "./UninterpretedOption";

export class EnumOptions {
  static encode(message: EnumOptions, writer: Writer): void {
    writer.uint32(16);
    writer.bool(message.allowAlias);

    writer.uint32(24);
    writer.bool(message.deprecated);

    writer.uint32(48);
    writer.bool(message.deprecatedLegacyJsonFieldConflicts);

    const uninterpretedOption = message.uninterpretedOption;
    for (let i: i32 = 0; i < uninterpretedOption.length; ++i) {
      writer.uint32(7994);
      writer.fork();
      UninterpretedOption.encode(uninterpretedOption[i], writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): EnumOptions {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new EnumOptions();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.allowAlias = reader.bool();
          break;

        case 3:
          message.deprecated = reader.bool();
          break;

        case 6:
          message.deprecatedLegacyJsonFieldConflicts = reader.bool();
          break;

        case 999:
          message.uninterpretedOption.push(
            UninterpretedOption.decode(reader, reader.uint32())
          );
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  allowAlias: bool;
  deprecated: bool;
  deprecatedLegacyJsonFieldConflicts: bool;
  uninterpretedOption: Array<UninterpretedOption>;

  constructor(
    allowAlias: bool = false,
    deprecated: bool = false,
    deprecatedLegacyJsonFieldConflicts: bool = false,
    uninterpretedOption: Array<UninterpretedOption> = []
  ) {
    this.allowAlias = allowAlias;
    this.deprecated = deprecated;
    this.deprecatedLegacyJsonFieldConflicts =
      deprecatedLegacyJsonFieldConflicts;
    this.uninterpretedOption = uninterpretedOption;
  }
}
