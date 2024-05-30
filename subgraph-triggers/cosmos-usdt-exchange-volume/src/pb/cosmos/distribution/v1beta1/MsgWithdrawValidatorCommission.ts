// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class MsgWithdrawValidatorCommission {
  static encode(message: MsgWithdrawValidatorCommission, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.validatorAddress);
  }

  static decode(reader: Reader, length: i32): MsgWithdrawValidatorCommission {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgWithdrawValidatorCommission();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorAddress = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  validatorAddress: string;

  constructor(validatorAddress: string = "") {
    this.validatorAddress = validatorAddress;
  }
}
