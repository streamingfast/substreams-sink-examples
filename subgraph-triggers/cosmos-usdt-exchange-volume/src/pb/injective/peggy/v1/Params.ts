// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { Coin } from "../../../cosmos/base/v1beta1/Coin";

export class Params {
  static encode(message: Params, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.peggyId);

    writer.uint32(18);
    writer.string(message.contractSourceHash);

    writer.uint32(26);
    writer.string(message.bridgeEthereumAddress);

    writer.uint32(32);
    writer.uint64(message.bridgeChainId);

    writer.uint32(40);
    writer.uint64(message.signedValsetsWindow);

    writer.uint32(48);
    writer.uint64(message.signedBatchesWindow);

    writer.uint32(56);
    writer.uint64(message.signedClaimsWindow);

    writer.uint32(64);
    writer.uint64(message.targetBatchTimeout);

    writer.uint32(72);
    writer.uint64(message.averageBlockTime);

    writer.uint32(80);
    writer.uint64(message.averageEthereumBlockTime);

    writer.uint32(90);
    writer.bytes(message.slashFractionValset);

    writer.uint32(98);
    writer.bytes(message.slashFractionBatch);

    writer.uint32(106);
    writer.bytes(message.slashFractionClaim);

    writer.uint32(114);
    writer.bytes(message.slashFractionConflictingClaim);

    writer.uint32(120);
    writer.uint64(message.unbondSlashingValsetsWindow);

    writer.uint32(130);
    writer.bytes(message.slashFractionBadEthSignature);

    writer.uint32(138);
    writer.string(message.cosmosCoinDenom);

    writer.uint32(146);
    writer.string(message.cosmosCoinErc20Contract);

    writer.uint32(152);
    writer.bool(message.claimSlashingEnabled);

    writer.uint32(160);
    writer.uint64(message.bridgeContractStartHeight);

    const valsetReward = message.valsetReward;
    if (valsetReward !== null) {
      writer.uint32(170);
      writer.fork();
      Coin.encode(valsetReward, writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): Params {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new Params();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.peggyId = reader.string();
          break;

        case 2:
          message.contractSourceHash = reader.string();
          break;

        case 3:
          message.bridgeEthereumAddress = reader.string();
          break;

        case 4:
          message.bridgeChainId = reader.uint64();
          break;

        case 5:
          message.signedValsetsWindow = reader.uint64();
          break;

        case 6:
          message.signedBatchesWindow = reader.uint64();
          break;

        case 7:
          message.signedClaimsWindow = reader.uint64();
          break;

        case 8:
          message.targetBatchTimeout = reader.uint64();
          break;

        case 9:
          message.averageBlockTime = reader.uint64();
          break;

        case 10:
          message.averageEthereumBlockTime = reader.uint64();
          break;

        case 11:
          message.slashFractionValset = reader.bytes();
          break;

        case 12:
          message.slashFractionBatch = reader.bytes();
          break;

        case 13:
          message.slashFractionClaim = reader.bytes();
          break;

        case 14:
          message.slashFractionConflictingClaim = reader.bytes();
          break;

        case 15:
          message.unbondSlashingValsetsWindow = reader.uint64();
          break;

        case 16:
          message.slashFractionBadEthSignature = reader.bytes();
          break;

        case 17:
          message.cosmosCoinDenom = reader.string();
          break;

        case 18:
          message.cosmosCoinErc20Contract = reader.string();
          break;

        case 19:
          message.claimSlashingEnabled = reader.bool();
          break;

        case 20:
          message.bridgeContractStartHeight = reader.uint64();
          break;

        case 21:
          message.valsetReward = Coin.decode(reader, reader.uint32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  peggyId: string;
  contractSourceHash: string;
  bridgeEthereumAddress: string;
  bridgeChainId: u64;
  signedValsetsWindow: u64;
  signedBatchesWindow: u64;
  signedClaimsWindow: u64;
  targetBatchTimeout: u64;
  averageBlockTime: u64;
  averageEthereumBlockTime: u64;
  slashFractionValset: Uint8Array;
  slashFractionBatch: Uint8Array;
  slashFractionClaim: Uint8Array;
  slashFractionConflictingClaim: Uint8Array;
  unbondSlashingValsetsWindow: u64;
  slashFractionBadEthSignature: Uint8Array;
  cosmosCoinDenom: string;
  cosmosCoinErc20Contract: string;
  claimSlashingEnabled: bool;
  bridgeContractStartHeight: u64;
  valsetReward: Coin | null;

  constructor(
    peggyId: string = "",
    contractSourceHash: string = "",
    bridgeEthereumAddress: string = "",
    bridgeChainId: u64 = 0,
    signedValsetsWindow: u64 = 0,
    signedBatchesWindow: u64 = 0,
    signedClaimsWindow: u64 = 0,
    targetBatchTimeout: u64 = 0,
    averageBlockTime: u64 = 0,
    averageEthereumBlockTime: u64 = 0,
    slashFractionValset: Uint8Array = new Uint8Array(0),
    slashFractionBatch: Uint8Array = new Uint8Array(0),
    slashFractionClaim: Uint8Array = new Uint8Array(0),
    slashFractionConflictingClaim: Uint8Array = new Uint8Array(0),
    unbondSlashingValsetsWindow: u64 = 0,
    slashFractionBadEthSignature: Uint8Array = new Uint8Array(0),
    cosmosCoinDenom: string = "",
    cosmosCoinErc20Contract: string = "",
    claimSlashingEnabled: bool = false,
    bridgeContractStartHeight: u64 = 0,
    valsetReward: Coin | null = null
  ) {
    this.peggyId = peggyId;
    this.contractSourceHash = contractSourceHash;
    this.bridgeEthereumAddress = bridgeEthereumAddress;
    this.bridgeChainId = bridgeChainId;
    this.signedValsetsWindow = signedValsetsWindow;
    this.signedBatchesWindow = signedBatchesWindow;
    this.signedClaimsWindow = signedClaimsWindow;
    this.targetBatchTimeout = targetBatchTimeout;
    this.averageBlockTime = averageBlockTime;
    this.averageEthereumBlockTime = averageEthereumBlockTime;
    this.slashFractionValset = slashFractionValset;
    this.slashFractionBatch = slashFractionBatch;
    this.slashFractionClaim = slashFractionClaim;
    this.slashFractionConflictingClaim = slashFractionConflictingClaim;
    this.unbondSlashingValsetsWindow = unbondSlashingValsetsWindow;
    this.slashFractionBadEthSignature = slashFractionBadEthSignature;
    this.cosmosCoinDenom = cosmosCoinDenom;
    this.cosmosCoinErc20Contract = cosmosCoinErc20Contract;
    this.claimSlashingEnabled = claimSlashingEnabled;
    this.bridgeContractStartHeight = bridgeContractStartHeight;
    this.valsetReward = valsetReward;
  }
}
