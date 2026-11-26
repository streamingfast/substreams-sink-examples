from sf.substreams.v1 import package_pb2 as _package_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class EstimateRequest(_message.Message):
    __slots__ = ("package", "output_module", "start_block_num", "stop_block_num", "sample_percentage", "params", "network")
    class ParamsEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    PACKAGE_FIELD_NUMBER: _ClassVar[int]
    OUTPUT_MODULE_FIELD_NUMBER: _ClassVar[int]
    START_BLOCK_NUM_FIELD_NUMBER: _ClassVar[int]
    STOP_BLOCK_NUM_FIELD_NUMBER: _ClassVar[int]
    SAMPLE_PERCENTAGE_FIELD_NUMBER: _ClassVar[int]
    PARAMS_FIELD_NUMBER: _ClassVar[int]
    NETWORK_FIELD_NUMBER: _ClassVar[int]
    package: _package_pb2.Package
    output_module: str
    start_block_num: int
    stop_block_num: int
    sample_percentage: float
    params: _containers.ScalarMap[str, str]
    network: str
    def __init__(self, package: _Optional[_Union[_package_pb2.Package, _Mapping]] = ..., output_module: _Optional[str] = ..., start_block_num: _Optional[int] = ..., stop_block_num: _Optional[int] = ..., sample_percentage: _Optional[float] = ..., params: _Optional[_Mapping[str, str]] = ..., network: _Optional[str] = ...) -> None: ...

class EstimateResponse(_message.Message):
    __slots__ = ("progress", "estimate")
    PROGRESS_FIELD_NUMBER: _ClassVar[int]
    ESTIMATE_FIELD_NUMBER: _ClassVar[int]
    progress: EstimateProgress
    estimate: Estimate
    def __init__(self, progress: _Optional[_Union[EstimateProgress, _Mapping]] = ..., estimate: _Optional[_Union[Estimate, _Mapping]] = ...) -> None: ...

class EstimateProgress(_message.Message):
    __slots__ = ("completed_segments", "total_segments")
    COMPLETED_SEGMENTS_FIELD_NUMBER: _ClassVar[int]
    TOTAL_SEGMENTS_FIELD_NUMBER: _ClassVar[int]
    completed_segments: int
    total_segments: int
    def __init__(self, completed_segments: _Optional[int] = ..., total_segments: _Optional[int] = ...) -> None: ...

class Estimate(_message.Message):
    __slots__ = ("resolved_start_block", "resolved_stop_block", "segment_block_count", "stage_count", "blocks_to_process", "total_blocks_to_process_uncached", "estimated_egress_bytes", "bytes_per_block", "sampling", "framing_bytes_per_message", "estimated_message_count", "block_filtered")
    RESOLVED_START_BLOCK_FIELD_NUMBER: _ClassVar[int]
    RESOLVED_STOP_BLOCK_FIELD_NUMBER: _ClassVar[int]
    SEGMENT_BLOCK_COUNT_FIELD_NUMBER: _ClassVar[int]
    STAGE_COUNT_FIELD_NUMBER: _ClassVar[int]
    BLOCKS_TO_PROCESS_FIELD_NUMBER: _ClassVar[int]
    TOTAL_BLOCKS_TO_PROCESS_UNCACHED_FIELD_NUMBER: _ClassVar[int]
    ESTIMATED_EGRESS_BYTES_FIELD_NUMBER: _ClassVar[int]
    BYTES_PER_BLOCK_FIELD_NUMBER: _ClassVar[int]
    SAMPLING_FIELD_NUMBER: _ClassVar[int]
    FRAMING_BYTES_PER_MESSAGE_FIELD_NUMBER: _ClassVar[int]
    ESTIMATED_MESSAGE_COUNT_FIELD_NUMBER: _ClassVar[int]
    BLOCK_FILTERED_FIELD_NUMBER: _ClassVar[int]
    resolved_start_block: int
    resolved_stop_block: int
    segment_block_count: int
    stage_count: int
    blocks_to_process: int
    total_blocks_to_process_uncached: int
    estimated_egress_bytes: int
    bytes_per_block: float
    sampling: Sampling
    framing_bytes_per_message: int
    estimated_message_count: int
    block_filtered: bool
    def __init__(self, resolved_start_block: _Optional[int] = ..., resolved_stop_block: _Optional[int] = ..., segment_block_count: _Optional[int] = ..., stage_count: _Optional[int] = ..., blocks_to_process: _Optional[int] = ..., total_blocks_to_process_uncached: _Optional[int] = ..., estimated_egress_bytes: _Optional[int] = ..., bytes_per_block: _Optional[float] = ..., sampling: _Optional[_Union[Sampling, _Mapping]] = ..., framing_bytes_per_message: _Optional[int] = ..., estimated_message_count: _Optional[int] = ..., block_filtered: _Optional[bool] = ...) -> None: ...

class Sampling(_message.Message):
    __slots__ = ("percentage", "note", "sampled_blocks", "sampled_bytes", "segments", "sampled_messages")
    PERCENTAGE_FIELD_NUMBER: _ClassVar[int]
    NOTE_FIELD_NUMBER: _ClassVar[int]
    SAMPLED_BLOCKS_FIELD_NUMBER: _ClassVar[int]
    SAMPLED_BYTES_FIELD_NUMBER: _ClassVar[int]
    SEGMENTS_FIELD_NUMBER: _ClassVar[int]
    SAMPLED_MESSAGES_FIELD_NUMBER: _ClassVar[int]
    percentage: float
    note: str
    sampled_blocks: int
    sampled_bytes: int
    segments: _containers.RepeatedCompositeFieldContainer[SampledSegment]
    sampled_messages: int
    def __init__(self, percentage: _Optional[float] = ..., note: _Optional[str] = ..., sampled_blocks: _Optional[int] = ..., sampled_bytes: _Optional[int] = ..., segments: _Optional[_Iterable[_Union[SampledSegment, _Mapping]]] = ..., sampled_messages: _Optional[int] = ...) -> None: ...

class SampledSegment(_message.Message):
    __slots__ = ("start_block", "stop_block", "uncompressed_bytes", "from_cache", "size_from_metadata", "represented_start_block", "represented_blocks", "estimated_bytes", "message_count", "processed_blocks")
    START_BLOCK_FIELD_NUMBER: _ClassVar[int]
    STOP_BLOCK_FIELD_NUMBER: _ClassVar[int]
    UNCOMPRESSED_BYTES_FIELD_NUMBER: _ClassVar[int]
    FROM_CACHE_FIELD_NUMBER: _ClassVar[int]
    SIZE_FROM_METADATA_FIELD_NUMBER: _ClassVar[int]
    REPRESENTED_START_BLOCK_FIELD_NUMBER: _ClassVar[int]
    REPRESENTED_BLOCKS_FIELD_NUMBER: _ClassVar[int]
    ESTIMATED_BYTES_FIELD_NUMBER: _ClassVar[int]
    MESSAGE_COUNT_FIELD_NUMBER: _ClassVar[int]
    PROCESSED_BLOCKS_FIELD_NUMBER: _ClassVar[int]
    start_block: int
    stop_block: int
    uncompressed_bytes: int
    from_cache: bool
    size_from_metadata: bool
    represented_start_block: int
    represented_blocks: int
    estimated_bytes: int
    message_count: int
    processed_blocks: int
    def __init__(self, start_block: _Optional[int] = ..., stop_block: _Optional[int] = ..., uncompressed_bytes: _Optional[int] = ..., from_cache: _Optional[bool] = ..., size_from_metadata: _Optional[bool] = ..., represented_start_block: _Optional[int] = ..., represented_blocks: _Optional[int] = ..., estimated_bytes: _Optional[int] = ..., message_count: _Optional[int] = ..., processed_blocks: _Optional[int] = ...) -> None: ...
