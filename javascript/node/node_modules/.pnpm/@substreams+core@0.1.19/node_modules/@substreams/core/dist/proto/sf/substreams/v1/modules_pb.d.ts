import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
/**
 * @generated from message sf.substreams.v1.Modules
 */
export declare class Modules extends Message<Modules> {
    /**
     * @generated from field: repeated sf.substreams.v1.Module modules = 1;
     */
    modules: Module[];
    /**
     * @generated from field: repeated sf.substreams.v1.Binary binaries = 2;
     */
    binaries: Binary[];
    constructor(data?: PartialMessage<Modules>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.v1.Modules";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Modules;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Modules;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Modules;
    static equals(a: Modules | PlainMessage<Modules> | undefined, b: Modules | PlainMessage<Modules> | undefined): boolean;
}
/**
 * Binary represents some code compiled to its binary form.
 *
 * @generated from message sf.substreams.v1.Binary
 */
export declare class Binary extends Message<Binary> {
    /**
     * @generated from field: string type = 1;
     */
    type: string;
    /**
     * @generated from field: bytes content = 2;
     */
    content: Uint8Array;
    constructor(data?: PartialMessage<Binary>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.v1.Binary";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Binary;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Binary;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Binary;
    static equals(a: Binary | PlainMessage<Binary> | undefined, b: Binary | PlainMessage<Binary> | undefined): boolean;
}
/**
 * @generated from message sf.substreams.v1.Module
 */
export declare class Module extends Message<Module> {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from oneof sf.substreams.v1.Module.kind
     */
    kind: {
        /**
         * @generated from field: sf.substreams.v1.Module.KindMap kind_map = 2;
         */
        value: Module_KindMap;
        case: "kindMap";
    } | {
        /**
         * @generated from field: sf.substreams.v1.Module.KindStore kind_store = 3;
         */
        value: Module_KindStore;
        case: "kindStore";
    } | {
        case: undefined;
        value?: undefined;
    };
    /**
     * @generated from field: uint32 binary_index = 4;
     */
    binaryIndex: number;
    /**
     * @generated from field: string binary_entrypoint = 5;
     */
    binaryEntrypoint: string;
    /**
     * @generated from field: repeated sf.substreams.v1.Module.Input inputs = 6;
     */
    inputs: Module_Input[];
    /**
     * @generated from field: sf.substreams.v1.Module.Output output = 7;
     */
    output?: Module_Output;
    /**
     * @generated from field: uint64 initial_block = 8;
     */
    initialBlock: bigint;
    constructor(data?: PartialMessage<Module>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.v1.Module";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Module;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Module;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Module;
    static equals(a: Module | PlainMessage<Module> | undefined, b: Module | PlainMessage<Module> | undefined): boolean;
}
/**
 * @generated from message sf.substreams.v1.Module.KindMap
 */
export declare class Module_KindMap extends Message<Module_KindMap> {
    /**
     * @generated from field: string output_type = 1;
     */
    outputType: string;
    constructor(data?: PartialMessage<Module_KindMap>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.v1.Module.KindMap";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Module_KindMap;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Module_KindMap;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Module_KindMap;
    static equals(a: Module_KindMap | PlainMessage<Module_KindMap> | undefined, b: Module_KindMap | PlainMessage<Module_KindMap> | undefined): boolean;
}
/**
 * @generated from message sf.substreams.v1.Module.KindStore
 */
export declare class Module_KindStore extends Message<Module_KindStore> {
    /**
     * The `update_policy` determines the functions available to mutate the store
     * (like `set()`, `set_if_not_exists()` or `sum()`, etc..) in
     * order to ensure that parallel operations are possible and deterministic
     *
     * Say a store cumulates keys from block 0 to 1M, and a second store
     * cumulates keys from block 1M to 2M. When we want to use this
     * store as a dependency for a downstream module, we will merge the
     * two stores according to this policy.
     *
     * @generated from field: sf.substreams.v1.Module.KindStore.UpdatePolicy update_policy = 1;
     */
    updatePolicy: Module_KindStore_UpdatePolicy;
    /**
     * @generated from field: string value_type = 2;
     */
    valueType: string;
    constructor(data?: PartialMessage<Module_KindStore>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.v1.Module.KindStore";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Module_KindStore;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Module_KindStore;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Module_KindStore;
    static equals(a: Module_KindStore | PlainMessage<Module_KindStore> | undefined, b: Module_KindStore | PlainMessage<Module_KindStore> | undefined): boolean;
}
/**
 * @generated from enum sf.substreams.v1.Module.KindStore.UpdatePolicy
 */
export declare enum Module_KindStore_UpdatePolicy {
    /**
     * @generated from enum value: UPDATE_POLICY_UNSET = 0;
     */
    UNSET = 0,
    /**
     * Provides a store where you can `set()` keys, and the latest key wins
     *
     * @generated from enum value: UPDATE_POLICY_SET = 1;
     */
    SET = 1,
    /**
     * Provides a store where you can `set_if_not_exists()` keys, and the first key wins
     *
     * @generated from enum value: UPDATE_POLICY_SET_IF_NOT_EXISTS = 2;
     */
    SET_IF_NOT_EXISTS = 2,
    /**
     * Provides a store where you can `add_*()` keys, where two stores merge by summing its values.
     *
     * @generated from enum value: UPDATE_POLICY_ADD = 3;
     */
    ADD = 3,
    /**
     * Provides a store where you can `min_*()` keys, where two stores merge by leaving the minimum value.
     *
     * @generated from enum value: UPDATE_POLICY_MIN = 4;
     */
    MIN = 4,
    /**
     * Provides a store where you can `max_*()` keys, where two stores merge by leaving the maximum value.
     *
     * @generated from enum value: UPDATE_POLICY_MAX = 5;
     */
    MAX = 5,
    /**
     * Provides a store where you can `append()` keys, where two stores merge by concatenating the bytes in order.
     *
     * @generated from enum value: UPDATE_POLICY_APPEND = 6;
     */
    APPEND = 6
}
/**
 * @generated from message sf.substreams.v1.Module.Input
 */
export declare class Module_Input extends Message<Module_Input> {
    /**
     * @generated from oneof sf.substreams.v1.Module.Input.input
     */
    input: {
        /**
         * @generated from field: sf.substreams.v1.Module.Input.Source source = 1;
         */
        value: Module_Input_Source;
        case: "source";
    } | {
        /**
         * @generated from field: sf.substreams.v1.Module.Input.Map map = 2;
         */
        value: Module_Input_Map;
        case: "map";
    } | {
        /**
         * @generated from field: sf.substreams.v1.Module.Input.Store store = 3;
         */
        value: Module_Input_Store;
        case: "store";
    } | {
        /**
         * @generated from field: sf.substreams.v1.Module.Input.Params params = 4;
         */
        value: Module_Input_Params;
        case: "params";
    } | {
        case: undefined;
        value?: undefined;
    };
    constructor(data?: PartialMessage<Module_Input>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.v1.Module.Input";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Module_Input;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Module_Input;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Module_Input;
    static equals(a: Module_Input | PlainMessage<Module_Input> | undefined, b: Module_Input | PlainMessage<Module_Input> | undefined): boolean;
}
/**
 * @generated from message sf.substreams.v1.Module.Input.Source
 */
export declare class Module_Input_Source extends Message<Module_Input_Source> {
    /**
     * ex: "sf.ethereum.type.v1.Block"
     *
     * @generated from field: string type = 1;
     */
    type: string;
    constructor(data?: PartialMessage<Module_Input_Source>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.v1.Module.Input.Source";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Module_Input_Source;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Module_Input_Source;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Module_Input_Source;
    static equals(a: Module_Input_Source | PlainMessage<Module_Input_Source> | undefined, b: Module_Input_Source | PlainMessage<Module_Input_Source> | undefined): boolean;
}
/**
 * @generated from message sf.substreams.v1.Module.Input.Map
 */
export declare class Module_Input_Map extends Message<Module_Input_Map> {
    /**
     * ex: "block_to_pairs"
     *
     * @generated from field: string module_name = 1;
     */
    moduleName: string;
    constructor(data?: PartialMessage<Module_Input_Map>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.v1.Module.Input.Map";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Module_Input_Map;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Module_Input_Map;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Module_Input_Map;
    static equals(a: Module_Input_Map | PlainMessage<Module_Input_Map> | undefined, b: Module_Input_Map | PlainMessage<Module_Input_Map> | undefined): boolean;
}
/**
 * @generated from message sf.substreams.v1.Module.Input.Store
 */
export declare class Module_Input_Store extends Message<Module_Input_Store> {
    /**
     * @generated from field: string module_name = 1;
     */
    moduleName: string;
    /**
     * @generated from field: sf.substreams.v1.Module.Input.Store.Mode mode = 2;
     */
    mode: Module_Input_Store_Mode;
    constructor(data?: PartialMessage<Module_Input_Store>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.v1.Module.Input.Store";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Module_Input_Store;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Module_Input_Store;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Module_Input_Store;
    static equals(a: Module_Input_Store | PlainMessage<Module_Input_Store> | undefined, b: Module_Input_Store | PlainMessage<Module_Input_Store> | undefined): boolean;
}
/**
 * @generated from enum sf.substreams.v1.Module.Input.Store.Mode
 */
export declare enum Module_Input_Store_Mode {
    /**
     * @generated from enum value: UNSET = 0;
     */
    UNSET = 0,
    /**
     * @generated from enum value: GET = 1;
     */
    GET = 1,
    /**
     * @generated from enum value: DELTAS = 2;
     */
    DELTAS = 2
}
/**
 * @generated from message sf.substreams.v1.Module.Input.Params
 */
export declare class Module_Input_Params extends Message<Module_Input_Params> {
    /**
     * @generated from field: string value = 1;
     */
    value: string;
    constructor(data?: PartialMessage<Module_Input_Params>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.v1.Module.Input.Params";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Module_Input_Params;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Module_Input_Params;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Module_Input_Params;
    static equals(a: Module_Input_Params | PlainMessage<Module_Input_Params> | undefined, b: Module_Input_Params | PlainMessage<Module_Input_Params> | undefined): boolean;
}
/**
 * @generated from message sf.substreams.v1.Module.Output
 */
export declare class Module_Output extends Message<Module_Output> {
    /**
     * @generated from field: string type = 1;
     */
    type: string;
    constructor(data?: PartialMessage<Module_Output>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.v1.Module.Output";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Module_Output;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Module_Output;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Module_Output;
    static equals(a: Module_Output | PlainMessage<Module_Output> | undefined, b: Module_Output | PlainMessage<Module_Output> | undefined): boolean;
}
//# sourceMappingURL=modules_pb.d.ts.map