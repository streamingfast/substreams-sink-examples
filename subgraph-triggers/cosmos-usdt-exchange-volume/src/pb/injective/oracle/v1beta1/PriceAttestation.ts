// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class PriceAttestation {
  static encode(message: PriceAttestation, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.priceId);

    writer.uint32(16);
    writer.int64(message.price);

    writer.uint32(24);
    writer.uint64(message.conf);

    writer.uint32(32);
    writer.int32(message.expo);

    writer.uint32(40);
    writer.int64(message.emaPrice);

    writer.uint32(48);
    writer.uint64(message.emaConf);

    writer.uint32(56);
    writer.int32(message.emaExpo);

    writer.uint32(64);
    writer.int64(message.publishTime);
  }

  static decode(reader: Reader, length: i32): PriceAttestation {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new PriceAttestation();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.priceId = reader.string();
          break;

        case 2:
          message.price = reader.int64();
          break;

        case 3:
          message.conf = reader.uint64();
          break;

        case 4:
          message.expo = reader.int32();
          break;

        case 5:
          message.emaPrice = reader.int64();
          break;

        case 6:
          message.emaConf = reader.uint64();
          break;

        case 7:
          message.emaExpo = reader.int32();
          break;

        case 8:
          message.publishTime = reader.int64();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  priceId: string;
  price: i64;
  conf: u64;
  expo: i32;
  emaPrice: i64;
  emaConf: u64;
  emaExpo: i32;
  publishTime: i64;

  constructor(
    priceId: string = "",
    price: i64 = 0,
    conf: u64 = 0,
    expo: i32 = 0,
    emaPrice: i64 = 0,
    emaConf: u64 = 0,
    emaExpo: i32 = 0,
    publishTime: i64 = 0
  ) {
    this.priceId = priceId;
    this.price = price;
    this.conf = conf;
    this.expo = expo;
    this.emaPrice = emaPrice;
    this.emaConf = emaConf;
    this.emaExpo = emaExpo;
    this.publishTime = publishTime;
  }
}
