// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { SignDocDirectAux } from "./SignDocDirectAux";
import { SignMode } from "../signing/v1beta1/SignMode";

export class AuxSignerData {
  static encode(message: AuxSignerData, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.address);

    const signDoc = message.signDoc;
    if (signDoc !== null) {
      writer.uint32(18);
      writer.fork();
      SignDocDirectAux.encode(signDoc, writer);
      writer.ldelim();
    }

    writer.uint32(24);
    writer.int32(message.mode);

    writer.uint32(34);
    writer.bytes(message.sig);
  }

  static decode(reader: Reader, length: i32): AuxSignerData {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new AuxSignerData();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;

        case 2:
          message.signDoc = SignDocDirectAux.decode(reader, reader.uint32());
          break;

        case 3:
          message.mode = reader.int32();
          break;

        case 4:
          message.sig = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  address: string;
  signDoc: SignDocDirectAux | null;
  mode: SignMode;
  sig: Uint8Array;

  constructor(
    address: string = "",
    signDoc: SignDocDirectAux | null = null,
    mode: SignMode = 0,
    sig: Uint8Array = new Uint8Array(0)
  ) {
    this.address = address;
    this.signDoc = signDoc;
    this.mode = mode;
    this.sig = sig;
  }
}
