// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class MsgBatchUpdateOrdersResponse {
  static encode(message: MsgBatchUpdateOrdersResponse, writer: Writer): void {
    const spotCancelSuccess = message.spotCancelSuccess;
    if (spotCancelSuccess.length !== 0) {
      for (let i: i32 = 0; i < spotCancelSuccess.length; ++i) {
        writer.uint32(8);
        writer.bool(spotCancelSuccess[i]);
      }
    }

    const derivativeCancelSuccess = message.derivativeCancelSuccess;
    if (derivativeCancelSuccess.length !== 0) {
      for (let i: i32 = 0; i < derivativeCancelSuccess.length; ++i) {
        writer.uint32(16);
        writer.bool(derivativeCancelSuccess[i]);
      }
    }

    const spotOrderHashes = message.spotOrderHashes;
    if (spotOrderHashes.length !== 0) {
      for (let i: i32 = 0; i < spotOrderHashes.length; ++i) {
        writer.uint32(26);
        writer.string(spotOrderHashes[i]);
      }
    }

    const derivativeOrderHashes = message.derivativeOrderHashes;
    if (derivativeOrderHashes.length !== 0) {
      for (let i: i32 = 0; i < derivativeOrderHashes.length; ++i) {
        writer.uint32(34);
        writer.string(derivativeOrderHashes[i]);
      }
    }

    const binaryOptionsCancelSuccess = message.binaryOptionsCancelSuccess;
    if (binaryOptionsCancelSuccess.length !== 0) {
      for (let i: i32 = 0; i < binaryOptionsCancelSuccess.length; ++i) {
        writer.uint32(40);
        writer.bool(binaryOptionsCancelSuccess[i]);
      }
    }

    const binaryOptionsOrderHashes = message.binaryOptionsOrderHashes;
    if (binaryOptionsOrderHashes.length !== 0) {
      for (let i: i32 = 0; i < binaryOptionsOrderHashes.length; ++i) {
        writer.uint32(50);
        writer.string(binaryOptionsOrderHashes[i]);
      }
    }
  }

  static decode(reader: Reader, length: i32): MsgBatchUpdateOrdersResponse {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgBatchUpdateOrdersResponse();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.spotCancelSuccess.push(reader.bool());
          break;

        case 2:
          message.derivativeCancelSuccess.push(reader.bool());
          break;

        case 3:
          message.spotOrderHashes.push(reader.string());
          break;

        case 4:
          message.derivativeOrderHashes.push(reader.string());
          break;

        case 5:
          message.binaryOptionsCancelSuccess.push(reader.bool());
          break;

        case 6:
          message.binaryOptionsOrderHashes.push(reader.string());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  spotCancelSuccess: Array<bool>;
  derivativeCancelSuccess: Array<bool>;
  spotOrderHashes: Array<string>;
  derivativeOrderHashes: Array<string>;
  binaryOptionsCancelSuccess: Array<bool>;
  binaryOptionsOrderHashes: Array<string>;

  constructor(
    spotCancelSuccess: Array<bool> = [],
    derivativeCancelSuccess: Array<bool> = [],
    spotOrderHashes: Array<string> = [],
    derivativeOrderHashes: Array<string> = [],
    binaryOptionsCancelSuccess: Array<bool> = [],
    binaryOptionsOrderHashes: Array<string> = []
  ) {
    this.spotCancelSuccess = spotCancelSuccess;
    this.derivativeCancelSuccess = derivativeCancelSuccess;
    this.spotOrderHashes = spotOrderHashes;
    this.derivativeOrderHashes = derivativeOrderHashes;
    this.binaryOptionsCancelSuccess = binaryOptionsCancelSuccess;
    this.binaryOptionsOrderHashes = binaryOptionsOrderHashes;
  }
}
