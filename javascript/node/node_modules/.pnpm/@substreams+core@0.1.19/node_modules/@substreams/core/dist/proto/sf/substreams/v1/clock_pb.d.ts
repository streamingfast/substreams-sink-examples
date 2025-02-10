import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";
/**
 * Clock is a pointer to a block with added timestamp
 *
 * @generated from message sf.substreams.v1.Clock
 */
export declare class Clock extends Message<Clock> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: uint64 number = 2;
     */
    number: bigint;
    /**
     * @generated from field: google.protobuf.Timestamp timestamp = 3;
     */
    timestamp?: Timestamp;
    constructor(data?: PartialMessage<Clock>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.v1.Clock";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Clock;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Clock;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Clock;
    static equals(a: Clock | PlainMessage<Clock> | undefined, b: Clock | PlainMessage<Clock> | undefined): boolean;
}
/**
 * BlockRef is a pointer to a block to which we don't know the timestamp
 *
 * @generated from message sf.substreams.v1.BlockRef
 */
export declare class BlockRef extends Message<BlockRef> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: uint64 number = 2;
     */
    number: bigint;
    constructor(data?: PartialMessage<BlockRef>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.v1.BlockRef";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): BlockRef;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): BlockRef;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): BlockRef;
    static equals(a: BlockRef | PlainMessage<BlockRef> | undefined, b: BlockRef | PlainMessage<BlockRef> | undefined): boolean;
}
//# sourceMappingURL=clock_pb.d.ts.map