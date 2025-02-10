import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { Modules } from "../../v1/modules_pb.js";
/**
 * @generated from message sf.substreams.internal.v2.ProcessRangeRequest
 */
export declare class ProcessRangeRequest extends Message<ProcessRangeRequest> {
    /**
     * @generated from field: uint64 start_block_num = 1;
     */
    startBlockNum: bigint;
    /**
     * @generated from field: uint64 stop_block_num = 2;
     */
    stopBlockNum: bigint;
    /**
     * @generated from field: string output_module = 3;
     */
    outputModule: string;
    /**
     * @generated from field: sf.substreams.v1.Modules modules = 4;
     */
    modules?: Modules;
    /**
     * 0-based index of stage to execute up to
     *
     * @generated from field: uint32 stage = 5;
     */
    stage: number;
    constructor(data?: PartialMessage<ProcessRangeRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.internal.v2.ProcessRangeRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ProcessRangeRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ProcessRangeRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ProcessRangeRequest;
    static equals(a: ProcessRangeRequest | PlainMessage<ProcessRangeRequest> | undefined, b: ProcessRangeRequest | PlainMessage<ProcessRangeRequest> | undefined): boolean;
}
/**
 * @generated from message sf.substreams.internal.v2.ProcessRangeResponse
 */
export declare class ProcessRangeResponse extends Message<ProcessRangeResponse> {
    /**
     * @generated from oneof sf.substreams.internal.v2.ProcessRangeResponse.type
     */
    type: {
        /**
         * @generated from field: sf.substreams.internal.v2.Failed failed = 4;
         */
        value: Failed;
        case: "failed";
    } | {
        /**
         * @generated from field: sf.substreams.internal.v2.Completed completed = 5;
         */
        value: Completed;
        case: "completed";
    } | {
        /**
         * @generated from field: sf.substreams.internal.v2.Update update = 6;
         */
        value: Update;
        case: "update";
    } | {
        case: undefined;
        value?: undefined;
    };
    constructor(data?: PartialMessage<ProcessRangeResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.internal.v2.ProcessRangeResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ProcessRangeResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ProcessRangeResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ProcessRangeResponse;
    static equals(a: ProcessRangeResponse | PlainMessage<ProcessRangeResponse> | undefined, b: ProcessRangeResponse | PlainMessage<ProcessRangeResponse> | undefined): boolean;
}
/**
 * @generated from message sf.substreams.internal.v2.Update
 */
export declare class Update extends Message<Update> {
    /**
     * @generated from field: uint64 duration_ms = 1;
     */
    durationMs: bigint;
    /**
     * @generated from field: uint64 processed_blocks = 2;
     */
    processedBlocks: bigint;
    /**
     * @generated from field: uint64 total_bytes_read = 3;
     */
    totalBytesRead: bigint;
    /**
     * @generated from field: uint64 total_bytes_written = 4;
     */
    totalBytesWritten: bigint;
    /**
     * @generated from field: repeated sf.substreams.internal.v2.ModuleStats modules_stats = 5;
     */
    modulesStats: ModuleStats[];
    constructor(data?: PartialMessage<Update>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.internal.v2.Update";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Update;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Update;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Update;
    static equals(a: Update | PlainMessage<Update> | undefined, b: Update | PlainMessage<Update> | undefined): boolean;
}
/**
 * @generated from message sf.substreams.internal.v2.ModuleStats
 */
export declare class ModuleStats extends Message<ModuleStats> {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: uint64 processing_time_ms = 2;
     */
    processingTimeMs: bigint;
    /**
     * @generated from field: uint64 store_operation_time_ms = 3;
     */
    storeOperationTimeMs: bigint;
    /**
     * @generated from field: uint64 store_read_count = 4;
     */
    storeReadCount: bigint;
    /**
     * @generated from field: repeated sf.substreams.internal.v2.ExternalCallMetric external_call_metrics = 5;
     */
    externalCallMetrics: ExternalCallMetric[];
    /**
     * store-specific (will be 0 on mappers)
     *
     * @generated from field: uint64 store_write_count = 10;
     */
    storeWriteCount: bigint;
    /**
     * @generated from field: uint64 store_deleteprefix_count = 11;
     */
    storeDeleteprefixCount: bigint;
    /**
     * @generated from field: uint64 store_size_bytes = 12;
     */
    storeSizeBytes: bigint;
    constructor(data?: PartialMessage<ModuleStats>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.internal.v2.ModuleStats";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ModuleStats;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ModuleStats;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ModuleStats;
    static equals(a: ModuleStats | PlainMessage<ModuleStats> | undefined, b: ModuleStats | PlainMessage<ModuleStats> | undefined): boolean;
}
/**
 * @generated from message sf.substreams.internal.v2.ExternalCallMetric
 */
export declare class ExternalCallMetric extends Message<ExternalCallMetric> {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: uint64 count = 2;
     */
    count: bigint;
    /**
     * @generated from field: uint64 time_ms = 3;
     */
    timeMs: bigint;
    constructor(data?: PartialMessage<ExternalCallMetric>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.internal.v2.ExternalCallMetric";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ExternalCallMetric;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ExternalCallMetric;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ExternalCallMetric;
    static equals(a: ExternalCallMetric | PlainMessage<ExternalCallMetric> | undefined, b: ExternalCallMetric | PlainMessage<ExternalCallMetric> | undefined): boolean;
}
/**
 * @generated from message sf.substreams.internal.v2.Completed
 */
export declare class Completed extends Message<Completed> {
    /**
     * @generated from field: repeated sf.substreams.internal.v2.BlockRange all_processed_ranges = 1;
     */
    allProcessedRanges: BlockRange[];
    /**
     * TraceId represents the producer's trace id that produced the partial files.
     * This is present here so that the consumer can use it to identify the
     * right partial files that needs to be squashed together.
     *
     * The TraceId can be empty in which case it should be assumed by the tier1
     * consuming this message that the tier2 that produced those partial files
     * is not yet updated to produce a trace id and a such, the tier1 should
     * generate a legacy partial file name.
     *
     * @generated from field: string trace_id = 2;
     */
    traceId: string;
    constructor(data?: PartialMessage<Completed>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.internal.v2.Completed";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Completed;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Completed;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Completed;
    static equals(a: Completed | PlainMessage<Completed> | undefined, b: Completed | PlainMessage<Completed> | undefined): boolean;
}
/**
 * @generated from message sf.substreams.internal.v2.Failed
 */
export declare class Failed extends Message<Failed> {
    /**
     * @generated from field: string reason = 1;
     */
    reason: string;
    /**
     * @generated from field: repeated string logs = 2;
     */
    logs: string[];
    /**
     * FailureLogsTruncated is a flag that tells you if you received all the logs or if they
     * were truncated because you logged too much (fixed limit currently is set to 128 KiB).
     *
     * @generated from field: bool logs_truncated = 3;
     */
    logsTruncated: boolean;
    constructor(data?: PartialMessage<Failed>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.internal.v2.Failed";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Failed;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Failed;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Failed;
    static equals(a: Failed | PlainMessage<Failed> | undefined, b: Failed | PlainMessage<Failed> | undefined): boolean;
}
/**
 * @generated from message sf.substreams.internal.v2.BlockRange
 */
export declare class BlockRange extends Message<BlockRange> {
    /**
     * @generated from field: uint64 start_block = 2;
     */
    startBlock: bigint;
    /**
     * @generated from field: uint64 end_block = 3;
     */
    endBlock: bigint;
    constructor(data?: PartialMessage<BlockRange>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "sf.substreams.internal.v2.BlockRange";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): BlockRange;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): BlockRange;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): BlockRange;
    static equals(a: BlockRange | PlainMessage<BlockRange> | undefined, b: BlockRange | PlainMessage<BlockRange> | undefined): boolean;
}
//# sourceMappingURL=service_pb.d.ts.map