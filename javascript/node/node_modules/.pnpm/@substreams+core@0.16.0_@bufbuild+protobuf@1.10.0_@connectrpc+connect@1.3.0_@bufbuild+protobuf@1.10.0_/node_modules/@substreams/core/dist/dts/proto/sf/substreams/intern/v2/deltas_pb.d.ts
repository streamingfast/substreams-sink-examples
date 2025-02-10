import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Any, Message, proto3 } from "@bufbuild/protobuf";
/**
 * @generated from message sf.substreams.internal.v2.StoreDeltas
 */
export declare class StoreDeltas extends Message<StoreDeltas> {
    /**
     * @generated from field: repeated sf.substreams.internal.v2.StoreDelta store_deltas = 1;
     */
    storeDeltas: StoreDelta[];
    constructor(data?: PartialMessage<StoreDeltas>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.internal.v2.StoreDeltas";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): StoreDeltas;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): StoreDeltas;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): StoreDeltas;
    static equals(a: StoreDeltas | PlainMessage<StoreDeltas> | undefined, b: StoreDeltas | PlainMessage<StoreDeltas> | undefined): boolean;
}
/**
 * @generated from message sf.substreams.internal.v2.StoreDelta
 */
export declare class StoreDelta extends Message<StoreDelta> {
    /**
     * @generated from field: sf.substreams.internal.v2.StoreDelta.Operation operation = 1;
     */
    operation: StoreDelta_Operation;
    /**
     * @generated from field: uint64 ordinal = 2;
     */
    ordinal: bigint;
    /**
     * @generated from field: string key = 3;
     */
    key: string;
    /**
     * @generated from field: bytes old_value = 4;
     */
    oldValue: Uint8Array;
    /**
     * @generated from field: bytes new_value = 5;
     */
    newValue: Uint8Array;
    constructor(data?: PartialMessage<StoreDelta>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.internal.v2.StoreDelta";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): StoreDelta;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): StoreDelta;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): StoreDelta;
    static equals(a: StoreDelta | PlainMessage<StoreDelta> | undefined, b: StoreDelta | PlainMessage<StoreDelta> | undefined): boolean;
}
/**
 * @generated from enum sf.substreams.internal.v2.StoreDelta.Operation
 */
export declare enum StoreDelta_Operation {
    /**
     * @generated from enum value: UNSET = 0;
     */
    UNSET = 0,
    /**
     * @generated from enum value: CREATE = 1;
     */
    CREATE = 1,
    /**
     * @generated from enum value: UPDATE = 2;
     */
    UPDATE = 2,
    /**
     * @generated from enum value: DELETE = 3;
     */
    DELETE = 3
}
/**
 * @generated from message sf.substreams.internal.v2.ModuleOutput
 */
export declare class ModuleOutput extends Message<ModuleOutput> {
    /**
     * @generated from field: string module_name = 1;
     */
    moduleName: string;
    /**
     * @generated from oneof sf.substreams.internal.v2.ModuleOutput.data
     */
    data: {
        /**
         * @generated from field: google.protobuf.Any map_output = 2;
         */
        value: Any;
        case: "mapOutput";
    } | {
        /**
         * @generated from field: sf.substreams.internal.v2.StoreDeltas store_deltas = 3;
         */
        value: StoreDeltas;
        case: "storeDeltas";
    } | {
        case: undefined;
        value?: undefined;
    };
    /**
     * @generated from field: repeated string logs = 4;
     */
    logs: string[];
    /**
     * @generated from field: bool debug_logs_truncated = 5;
     */
    debugLogsTruncated: boolean;
    /**
     * @generated from field: bool cached = 6;
     */
    cached: boolean;
    constructor(data?: PartialMessage<ModuleOutput>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.internal.v2.ModuleOutput";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ModuleOutput;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ModuleOutput;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ModuleOutput;
    static equals(a: ModuleOutput | PlainMessage<ModuleOutput> | undefined, b: ModuleOutput | PlainMessage<ModuleOutput> | undefined): boolean;
}
//# sourceMappingURL=deltas_pb.d.ts.map