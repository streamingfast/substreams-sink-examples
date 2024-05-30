// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { OracleType } from "../../oracle/v1beta1/OracleType";

export class MsgInstantBinaryOptionsMarketLaunch {
  static encode(
    message: MsgInstantBinaryOptionsMarketLaunch,
    writer: Writer
  ): void {
    writer.uint32(10);
    writer.string(message.sender);

    writer.uint32(18);
    writer.string(message.ticker);

    writer.uint32(26);
    writer.string(message.oracleSymbol);

    writer.uint32(34);
    writer.string(message.oracleProvider);

    writer.uint32(40);
    writer.int32(message.oracleType);

    writer.uint32(48);
    writer.uint32(message.oracleScaleFactor);

    writer.uint32(58);
    writer.string(message.makerFeeRate);

    writer.uint32(66);
    writer.string(message.takerFeeRate);

    writer.uint32(72);
    writer.int64(message.expirationTimestamp);

    writer.uint32(80);
    writer.int64(message.settlementTimestamp);

    writer.uint32(90);
    writer.string(message.admin);

    writer.uint32(98);
    writer.string(message.quoteDenom);

    writer.uint32(106);
    writer.string(message.minPriceTickSize);

    writer.uint32(114);
    writer.string(message.minQuantityTickSize);
  }

  static decode(
    reader: Reader,
    length: i32
  ): MsgInstantBinaryOptionsMarketLaunch {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgInstantBinaryOptionsMarketLaunch();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;

        case 2:
          message.ticker = reader.string();
          break;

        case 3:
          message.oracleSymbol = reader.string();
          break;

        case 4:
          message.oracleProvider = reader.string();
          break;

        case 5:
          message.oracleType = reader.int32();
          break;

        case 6:
          message.oracleScaleFactor = reader.uint32();
          break;

        case 7:
          message.makerFeeRate = reader.string();
          break;

        case 8:
          message.takerFeeRate = reader.string();
          break;

        case 9:
          message.expirationTimestamp = reader.int64();
          break;

        case 10:
          message.settlementTimestamp = reader.int64();
          break;

        case 11:
          message.admin = reader.string();
          break;

        case 12:
          message.quoteDenom = reader.string();
          break;

        case 13:
          message.minPriceTickSize = reader.string();
          break;

        case 14:
          message.minQuantityTickSize = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  sender: string;
  ticker: string;
  oracleSymbol: string;
  oracleProvider: string;
  oracleType: OracleType;
  oracleScaleFactor: u32;
  makerFeeRate: string;
  takerFeeRate: string;
  expirationTimestamp: i64;
  settlementTimestamp: i64;
  admin: string;
  quoteDenom: string;
  minPriceTickSize: string;
  minQuantityTickSize: string;

  constructor(
    sender: string = "",
    ticker: string = "",
    oracleSymbol: string = "",
    oracleProvider: string = "",
    oracleType: OracleType = 0,
    oracleScaleFactor: u32 = 0,
    makerFeeRate: string = "",
    takerFeeRate: string = "",
    expirationTimestamp: i64 = 0,
    settlementTimestamp: i64 = 0,
    admin: string = "",
    quoteDenom: string = "",
    minPriceTickSize: string = "",
    minQuantityTickSize: string = ""
  ) {
    this.sender = sender;
    this.ticker = ticker;
    this.oracleSymbol = oracleSymbol;
    this.oracleProvider = oracleProvider;
    this.oracleType = oracleType;
    this.oracleScaleFactor = oracleScaleFactor;
    this.makerFeeRate = makerFeeRate;
    this.takerFeeRate = takerFeeRate;
    this.expirationTimestamp = expirationTimestamp;
    this.settlementTimestamp = settlementTimestamp;
    this.admin = admin;
    this.quoteDenom = quoteDenom;
    this.minPriceTickSize = minPriceTickSize;
    this.minQuantityTickSize = minQuantityTickSize;
  }
}
