from google.protobuf import any_pb2 as _any_pb2
from sf.firehose.v2 import firehose_pb2 as _firehose_pb2
from sf.substreams.v1 import clock_pb2 as _clock_pb2
from sf.substreams.v1 import modules_pb2 as _modules_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class Request(_message.Message):
    __slots__ = ("start_block_num", "start_cursor", "stop_block_num", "final_blocks_only", "production_mode", "output_module", "modules", "debug_initial_store_snapshot_for_modules", "noop_mode", "limit_processed_blocks", "dev_output_modules", "progress_messages_interval_ms", "partial_blocks")
    START_BLOCK_NUM_FIELD_NUMBER: _ClassVar[int]
    START_CURSOR_FIELD_NUMBER: _ClassVar[int]
    STOP_BLOCK_NUM_FIELD_NUMBER: _ClassVar[int]
    FINAL_BLOCKS_ONLY_FIELD_NUMBER: _ClassVar[int]
    PRODUCTION_MODE_FIELD_NUMBER: _ClassVar[int]
    OUTPUT_MODULE_FIELD_NUMBER: _ClassVar[int]
    MODULES_FIELD_NUMBER: _ClassVar[int]
    DEBUG_INITIAL_STORE_SNAPSHOT_FOR_MODULES_FIELD_NUMBER: _ClassVar[int]
    NOOP_MODE_FIELD_NUMBER: _ClassVar[int]
    LIMIT_PROCESSED_BLOCKS_FIELD_NUMBER: _ClassVar[int]
    DEV_OUTPUT_MODULES_FIELD_NUMBER: _ClassVar[int]
    PROGRESS_MESSAGES_INTERVAL_MS_FIELD_NUMBER: _ClassVar[int]
    PARTIAL_BLOCKS_FIELD_NUMBER: _ClassVar[int]
    start_block_num: int
    start_cursor: str
    stop_block_num: int
    final_blocks_only: bool
    production_mode: bool
    output_module: str
    modules: _modules_pb2.Modules
    debug_initial_store_snapshot_for_modules: _containers.RepeatedScalarFieldContainer[str]
    noop_mode: bool
    limit_processed_blocks: int
    dev_output_modules: _containers.RepeatedScalarFieldContainer[str]
    progress_messages_interval_ms: int
    partial_blocks: bool
    def __init__(self, start_block_num: _Optional[int] = ..., start_cursor: _Optional[str] = ..., stop_block_num: _Optional[int] = ..., final_blocks_only: _Optional[bool] = ..., production_mode: _Optional[bool] = ..., output_module: _Optional[str] = ..., modules: _Optional[_Union[_modules_pb2.Modules, _Mapping]] = ..., debug_initial_store_snapshot_for_modules: _Optional[_Iterable[str]] = ..., noop_mode: _Optional[bool] = ..., limit_processed_blocks: _Optional[int] = ..., dev_output_modules: _Optional[_Iterable[str]] = ..., progress_messages_interval_ms: _Optional[int] = ..., partial_blocks: _Optional[bool] = ...) -> None: ...

class Response(_message.Message):
    __slots__ = ("session", "progress", "block_scoped_data", "block_undo_signal", "fatal_error", "debug_snapshot_data", "debug_snapshot_complete")
    SESSION_FIELD_NUMBER: _ClassVar[int]
    PROGRESS_FIELD_NUMBER: _ClassVar[int]
    BLOCK_SCOPED_DATA_FIELD_NUMBER: _ClassVar[int]
    BLOCK_UNDO_SIGNAL_FIELD_NUMBER: _ClassVar[int]
    FATAL_ERROR_FIELD_NUMBER: _ClassVar[int]
    DEBUG_SNAPSHOT_DATA_FIELD_NUMBER: _ClassVar[int]
    DEBUG_SNAPSHOT_COMPLETE_FIELD_NUMBER: _ClassVar[int]
    session: SessionInit
    progress: ModulesProgress
    block_scoped_data: BlockScopedData
    block_undo_signal: BlockUndoSignal
    fatal_error: Error
    debug_snapshot_data: InitialSnapshotData
    debug_snapshot_complete: InitialSnapshotComplete
    def __init__(self, session: _Optional[_Union[SessionInit, _Mapping]] = ..., progress: _Optional[_Union[ModulesProgress, _Mapping]] = ..., block_scoped_data: _Optional[_Union[BlockScopedData, _Mapping]] = ..., block_undo_signal: _Optional[_Union[BlockUndoSignal, _Mapping]] = ..., fatal_error: _Optional[_Union[Error, _Mapping]] = ..., debug_snapshot_data: _Optional[_Union[InitialSnapshotData, _Mapping]] = ..., debug_snapshot_complete: _Optional[_Union[InitialSnapshotComplete, _Mapping]] = ...) -> None: ...

class BlockUndoSignal(_message.Message):
    __slots__ = ("last_valid_block", "last_valid_cursor")
    LAST_VALID_BLOCK_FIELD_NUMBER: _ClassVar[int]
    LAST_VALID_CURSOR_FIELD_NUMBER: _ClassVar[int]
    last_valid_block: _clock_pb2.BlockRef
    last_valid_cursor: str
    def __init__(self, last_valid_block: _Optional[_Union[_clock_pb2.BlockRef, _Mapping]] = ..., last_valid_cursor: _Optional[str] = ...) -> None: ...

class BlockScopedData(_message.Message):
    __slots__ = ("output", "clock", "cursor", "final_block_height", "debug_map_outputs", "debug_store_outputs", "attestation", "is_partial", "partial_index", "is_last_partial")
    OUTPUT_FIELD_NUMBER: _ClassVar[int]
    CLOCK_FIELD_NUMBER: _ClassVar[int]
    CURSOR_FIELD_NUMBER: _ClassVar[int]
    FINAL_BLOCK_HEIGHT_FIELD_NUMBER: _ClassVar[int]
    DEBUG_MAP_OUTPUTS_FIELD_NUMBER: _ClassVar[int]
    DEBUG_STORE_OUTPUTS_FIELD_NUMBER: _ClassVar[int]
    ATTESTATION_FIELD_NUMBER: _ClassVar[int]
    IS_PARTIAL_FIELD_NUMBER: _ClassVar[int]
    PARTIAL_INDEX_FIELD_NUMBER: _ClassVar[int]
    IS_LAST_PARTIAL_FIELD_NUMBER: _ClassVar[int]
    output: MapModuleOutput
    clock: _clock_pb2.Clock
    cursor: str
    final_block_height: int
    debug_map_outputs: _containers.RepeatedCompositeFieldContainer[MapModuleOutput]
    debug_store_outputs: _containers.RepeatedCompositeFieldContainer[StoreModuleOutput]
    attestation: str
    is_partial: bool
    partial_index: int
    is_last_partial: bool
    def __init__(self, output: _Optional[_Union[MapModuleOutput, _Mapping]] = ..., clock: _Optional[_Union[_clock_pb2.Clock, _Mapping]] = ..., cursor: _Optional[str] = ..., final_block_height: _Optional[int] = ..., debug_map_outputs: _Optional[_Iterable[_Union[MapModuleOutput, _Mapping]]] = ..., debug_store_outputs: _Optional[_Iterable[_Union[StoreModuleOutput, _Mapping]]] = ..., attestation: _Optional[str] = ..., is_partial: _Optional[bool] = ..., partial_index: _Optional[int] = ..., is_last_partial: _Optional[bool] = ...) -> None: ...

class SessionInit(_message.Message):
    __slots__ = ("trace_id", "resolved_start_block", "linear_handoff_block", "max_parallel_workers", "attestation_public_key", "chain_head", "blocks_to_process_before_start_block", "effective_blocks_to_process_before_start_block", "blocks_to_process_after_start_block", "effective_blocks_to_process_after_start_block", "segment_block_count")
    TRACE_ID_FIELD_NUMBER: _ClassVar[int]
    RESOLVED_START_BLOCK_FIELD_NUMBER: _ClassVar[int]
    LINEAR_HANDOFF_BLOCK_FIELD_NUMBER: _ClassVar[int]
    MAX_PARALLEL_WORKERS_FIELD_NUMBER: _ClassVar[int]
    ATTESTATION_PUBLIC_KEY_FIELD_NUMBER: _ClassVar[int]
    CHAIN_HEAD_FIELD_NUMBER: _ClassVar[int]
    BLOCKS_TO_PROCESS_BEFORE_START_BLOCK_FIELD_NUMBER: _ClassVar[int]
    EFFECTIVE_BLOCKS_TO_PROCESS_BEFORE_START_BLOCK_FIELD_NUMBER: _ClassVar[int]
    BLOCKS_TO_PROCESS_AFTER_START_BLOCK_FIELD_NUMBER: _ClassVar[int]
    EFFECTIVE_BLOCKS_TO_PROCESS_AFTER_START_BLOCK_FIELD_NUMBER: _ClassVar[int]
    SEGMENT_BLOCK_COUNT_FIELD_NUMBER: _ClassVar[int]
    trace_id: str
    resolved_start_block: int
    linear_handoff_block: int
    max_parallel_workers: int
    attestation_public_key: str
    chain_head: int
    blocks_to_process_before_start_block: int
    effective_blocks_to_process_before_start_block: int
    blocks_to_process_after_start_block: int
    effective_blocks_to_process_after_start_block: int
    segment_block_count: int
    def __init__(self, trace_id: _Optional[str] = ..., resolved_start_block: _Optional[int] = ..., linear_handoff_block: _Optional[int] = ..., max_parallel_workers: _Optional[int] = ..., attestation_public_key: _Optional[str] = ..., chain_head: _Optional[int] = ..., blocks_to_process_before_start_block: _Optional[int] = ..., effective_blocks_to_process_before_start_block: _Optional[int] = ..., blocks_to_process_after_start_block: _Optional[int] = ..., effective_blocks_to_process_after_start_block: _Optional[int] = ..., segment_block_count: _Optional[int] = ...) -> None: ...

class InitialSnapshotComplete(_message.Message):
    __slots__ = ("cursor",)
    CURSOR_FIELD_NUMBER: _ClassVar[int]
    cursor: str
    def __init__(self, cursor: _Optional[str] = ...) -> None: ...

class InitialSnapshotData(_message.Message):
    __slots__ = ("module_name", "deltas", "sent_keys", "total_keys")
    MODULE_NAME_FIELD_NUMBER: _ClassVar[int]
    DELTAS_FIELD_NUMBER: _ClassVar[int]
    SENT_KEYS_FIELD_NUMBER: _ClassVar[int]
    TOTAL_KEYS_FIELD_NUMBER: _ClassVar[int]
    module_name: str
    deltas: _containers.RepeatedCompositeFieldContainer[StoreDelta]
    sent_keys: int
    total_keys: int
    def __init__(self, module_name: _Optional[str] = ..., deltas: _Optional[_Iterable[_Union[StoreDelta, _Mapping]]] = ..., sent_keys: _Optional[int] = ..., total_keys: _Optional[int] = ...) -> None: ...

class MapModuleOutput(_message.Message):
    __slots__ = ("name", "map_output", "debug_info")
    NAME_FIELD_NUMBER: _ClassVar[int]
    MAP_OUTPUT_FIELD_NUMBER: _ClassVar[int]
    DEBUG_INFO_FIELD_NUMBER: _ClassVar[int]
    name: str
    map_output: _any_pb2.Any
    debug_info: OutputDebugInfo
    def __init__(self, name: _Optional[str] = ..., map_output: _Optional[_Union[_any_pb2.Any, _Mapping]] = ..., debug_info: _Optional[_Union[OutputDebugInfo, _Mapping]] = ...) -> None: ...

class StoreModuleOutput(_message.Message):
    __slots__ = ("name", "debug_store_deltas", "debug_info")
    NAME_FIELD_NUMBER: _ClassVar[int]
    DEBUG_STORE_DELTAS_FIELD_NUMBER: _ClassVar[int]
    DEBUG_INFO_FIELD_NUMBER: _ClassVar[int]
    name: str
    debug_store_deltas: _containers.RepeatedCompositeFieldContainer[StoreDelta]
    debug_info: OutputDebugInfo
    def __init__(self, name: _Optional[str] = ..., debug_store_deltas: _Optional[_Iterable[_Union[StoreDelta, _Mapping]]] = ..., debug_info: _Optional[_Union[OutputDebugInfo, _Mapping]] = ...) -> None: ...

class OutputDebugInfo(_message.Message):
    __slots__ = ("logs", "logs_truncated", "cached")
    LOGS_FIELD_NUMBER: _ClassVar[int]
    LOGS_TRUNCATED_FIELD_NUMBER: _ClassVar[int]
    CACHED_FIELD_NUMBER: _ClassVar[int]
    logs: _containers.RepeatedScalarFieldContainer[str]
    logs_truncated: bool
    cached: bool
    def __init__(self, logs: _Optional[_Iterable[str]] = ..., logs_truncated: _Optional[bool] = ..., cached: _Optional[bool] = ...) -> None: ...

class ModulesProgress(_message.Message):
    __slots__ = ("running_jobs", "modules_stats", "stages", "processed_bytes", "processed_blocks")
    RUNNING_JOBS_FIELD_NUMBER: _ClassVar[int]
    MODULES_STATS_FIELD_NUMBER: _ClassVar[int]
    STAGES_FIELD_NUMBER: _ClassVar[int]
    PROCESSED_BYTES_FIELD_NUMBER: _ClassVar[int]
    PROCESSED_BLOCKS_FIELD_NUMBER: _ClassVar[int]
    running_jobs: _containers.RepeatedCompositeFieldContainer[Job]
    modules_stats: _containers.RepeatedCompositeFieldContainer[ModuleStats]
    stages: _containers.RepeatedCompositeFieldContainer[Stage]
    processed_bytes: ProcessedBytes
    processed_blocks: int
    def __init__(self, running_jobs: _Optional[_Iterable[_Union[Job, _Mapping]]] = ..., modules_stats: _Optional[_Iterable[_Union[ModuleStats, _Mapping]]] = ..., stages: _Optional[_Iterable[_Union[Stage, _Mapping]]] = ..., processed_bytes: _Optional[_Union[ProcessedBytes, _Mapping]] = ..., processed_blocks: _Optional[int] = ...) -> None: ...

class ProcessedBytes(_message.Message):
    __slots__ = ("total_bytes_read", "total_bytes_written")
    TOTAL_BYTES_READ_FIELD_NUMBER: _ClassVar[int]
    TOTAL_BYTES_WRITTEN_FIELD_NUMBER: _ClassVar[int]
    total_bytes_read: int
    total_bytes_written: int
    def __init__(self, total_bytes_read: _Optional[int] = ..., total_bytes_written: _Optional[int] = ...) -> None: ...

class Error(_message.Message):
    __slots__ = ("module", "reason", "logs", "logs_truncated")
    MODULE_FIELD_NUMBER: _ClassVar[int]
    REASON_FIELD_NUMBER: _ClassVar[int]
    LOGS_FIELD_NUMBER: _ClassVar[int]
    LOGS_TRUNCATED_FIELD_NUMBER: _ClassVar[int]
    module: str
    reason: str
    logs: _containers.RepeatedScalarFieldContainer[str]
    logs_truncated: bool
    def __init__(self, module: _Optional[str] = ..., reason: _Optional[str] = ..., logs: _Optional[_Iterable[str]] = ..., logs_truncated: _Optional[bool] = ...) -> None: ...

class Job(_message.Message):
    __slots__ = ("stage", "start_block", "stop_block", "progress_blocks", "duration_ms")
    STAGE_FIELD_NUMBER: _ClassVar[int]
    START_BLOCK_FIELD_NUMBER: _ClassVar[int]
    STOP_BLOCK_FIELD_NUMBER: _ClassVar[int]
    PROGRESS_BLOCKS_FIELD_NUMBER: _ClassVar[int]
    DURATION_MS_FIELD_NUMBER: _ClassVar[int]
    stage: int
    start_block: int
    stop_block: int
    progress_blocks: int
    duration_ms: int
    def __init__(self, stage: _Optional[int] = ..., start_block: _Optional[int] = ..., stop_block: _Optional[int] = ..., progress_blocks: _Optional[int] = ..., duration_ms: _Optional[int] = ...) -> None: ...

class Stage(_message.Message):
    __slots__ = ("modules", "completed_ranges", "ready_up_to_exclusive", "squash_wait_segment_count")
    MODULES_FIELD_NUMBER: _ClassVar[int]
    COMPLETED_RANGES_FIELD_NUMBER: _ClassVar[int]
    READY_UP_TO_EXCLUSIVE_FIELD_NUMBER: _ClassVar[int]
    SQUASH_WAIT_SEGMENT_COUNT_FIELD_NUMBER: _ClassVar[int]
    modules: _containers.RepeatedScalarFieldContainer[str]
    completed_ranges: _containers.RepeatedCompositeFieldContainer[BlockRange]
    ready_up_to_exclusive: int
    squash_wait_segment_count: int
    def __init__(self, modules: _Optional[_Iterable[str]] = ..., completed_ranges: _Optional[_Iterable[_Union[BlockRange, _Mapping]]] = ..., ready_up_to_exclusive: _Optional[int] = ..., squash_wait_segment_count: _Optional[int] = ...) -> None: ...

class ModuleStats(_message.Message):
    __slots__ = ("name", "total_processed_block_count", "total_processing_time_ms", "external_call_metrics", "total_store_operation_time_ms", "total_store_read_count", "total_store_write_count", "total_store_deleteprefix_count", "store_size_bytes", "total_store_merging_time_ms", "store_currently_merging", "highest_contiguous_block")
    NAME_FIELD_NUMBER: _ClassVar[int]
    TOTAL_PROCESSED_BLOCK_COUNT_FIELD_NUMBER: _ClassVar[int]
    TOTAL_PROCESSING_TIME_MS_FIELD_NUMBER: _ClassVar[int]
    EXTERNAL_CALL_METRICS_FIELD_NUMBER: _ClassVar[int]
    TOTAL_STORE_OPERATION_TIME_MS_FIELD_NUMBER: _ClassVar[int]
    TOTAL_STORE_READ_COUNT_FIELD_NUMBER: _ClassVar[int]
    TOTAL_STORE_WRITE_COUNT_FIELD_NUMBER: _ClassVar[int]
    TOTAL_STORE_DELETEPREFIX_COUNT_FIELD_NUMBER: _ClassVar[int]
    STORE_SIZE_BYTES_FIELD_NUMBER: _ClassVar[int]
    TOTAL_STORE_MERGING_TIME_MS_FIELD_NUMBER: _ClassVar[int]
    STORE_CURRENTLY_MERGING_FIELD_NUMBER: _ClassVar[int]
    HIGHEST_CONTIGUOUS_BLOCK_FIELD_NUMBER: _ClassVar[int]
    name: str
    total_processed_block_count: int
    total_processing_time_ms: int
    external_call_metrics: _containers.RepeatedCompositeFieldContainer[ExternalCallMetric]
    total_store_operation_time_ms: int
    total_store_read_count: int
    total_store_write_count: int
    total_store_deleteprefix_count: int
    store_size_bytes: int
    total_store_merging_time_ms: int
    store_currently_merging: bool
    highest_contiguous_block: int
    def __init__(self, name: _Optional[str] = ..., total_processed_block_count: _Optional[int] = ..., total_processing_time_ms: _Optional[int] = ..., external_call_metrics: _Optional[_Iterable[_Union[ExternalCallMetric, _Mapping]]] = ..., total_store_operation_time_ms: _Optional[int] = ..., total_store_read_count: _Optional[int] = ..., total_store_write_count: _Optional[int] = ..., total_store_deleteprefix_count: _Optional[int] = ..., store_size_bytes: _Optional[int] = ..., total_store_merging_time_ms: _Optional[int] = ..., store_currently_merging: _Optional[bool] = ..., highest_contiguous_block: _Optional[int] = ...) -> None: ...

class ExternalCallMetric(_message.Message):
    __slots__ = ("name", "count", "time_ms")
    NAME_FIELD_NUMBER: _ClassVar[int]
    COUNT_FIELD_NUMBER: _ClassVar[int]
    TIME_MS_FIELD_NUMBER: _ClassVar[int]
    name: str
    count: int
    time_ms: int
    def __init__(self, name: _Optional[str] = ..., count: _Optional[int] = ..., time_ms: _Optional[int] = ...) -> None: ...

class StoreDelta(_message.Message):
    __slots__ = ("operation", "ordinal", "key", "old_value", "new_value")
    class Operation(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
        __slots__ = ()
        UNSET: _ClassVar[StoreDelta.Operation]
        CREATE: _ClassVar[StoreDelta.Operation]
        UPDATE: _ClassVar[StoreDelta.Operation]
        DELETE: _ClassVar[StoreDelta.Operation]
    UNSET: StoreDelta.Operation
    CREATE: StoreDelta.Operation
    UPDATE: StoreDelta.Operation
    DELETE: StoreDelta.Operation
    OPERATION_FIELD_NUMBER: _ClassVar[int]
    ORDINAL_FIELD_NUMBER: _ClassVar[int]
    KEY_FIELD_NUMBER: _ClassVar[int]
    OLD_VALUE_FIELD_NUMBER: _ClassVar[int]
    NEW_VALUE_FIELD_NUMBER: _ClassVar[int]
    operation: StoreDelta.Operation
    ordinal: int
    key: str
    old_value: bytes
    new_value: bytes
    def __init__(self, operation: _Optional[_Union[StoreDelta.Operation, str]] = ..., ordinal: _Optional[int] = ..., key: _Optional[str] = ..., old_value: _Optional[bytes] = ..., new_value: _Optional[bytes] = ...) -> None: ...

class BlockRange(_message.Message):
    __slots__ = ("start_block", "end_block")
    START_BLOCK_FIELD_NUMBER: _ClassVar[int]
    END_BLOCK_FIELD_NUMBER: _ClassVar[int]
    start_block: int
    end_block: int
    def __init__(self, start_block: _Optional[int] = ..., end_block: _Optional[int] = ...) -> None: ...
