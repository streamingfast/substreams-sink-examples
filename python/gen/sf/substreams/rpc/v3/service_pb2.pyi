from google.protobuf import any_pb2 as _any_pb2
from sf.firehose.v2 import firehose_pb2 as _firehose_pb2
from sf.substreams.rpc.v2 import service_pb2 as _service_pb2
from sf.substreams.v1 import clock_pb2 as _clock_pb2
from sf.substreams.v1 import modules_pb2 as _modules_pb2
from sf.substreams.v1 import package_pb2 as _package_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class Request(_message.Message):
    __slots__ = ("start_block_num", "start_cursor", "stop_block_num", "final_blocks_only", "production_mode", "output_module", "package", "params", "network", "debug_initial_store_snapshot_for_modules", "noop_mode", "limit_processed_blocks", "dev_output_modules", "progress_messages_interval_ms", "partial_blocks")
    class ParamsEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    START_BLOCK_NUM_FIELD_NUMBER: _ClassVar[int]
    START_CURSOR_FIELD_NUMBER: _ClassVar[int]
    STOP_BLOCK_NUM_FIELD_NUMBER: _ClassVar[int]
    FINAL_BLOCKS_ONLY_FIELD_NUMBER: _ClassVar[int]
    PRODUCTION_MODE_FIELD_NUMBER: _ClassVar[int]
    OUTPUT_MODULE_FIELD_NUMBER: _ClassVar[int]
    PACKAGE_FIELD_NUMBER: _ClassVar[int]
    PARAMS_FIELD_NUMBER: _ClassVar[int]
    NETWORK_FIELD_NUMBER: _ClassVar[int]
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
    package: _package_pb2.Package
    params: _containers.ScalarMap[str, str]
    network: str
    debug_initial_store_snapshot_for_modules: _containers.RepeatedScalarFieldContainer[str]
    noop_mode: bool
    limit_processed_blocks: int
    dev_output_modules: _containers.RepeatedScalarFieldContainer[str]
    progress_messages_interval_ms: int
    partial_blocks: bool
    def __init__(self, start_block_num: _Optional[int] = ..., start_cursor: _Optional[str] = ..., stop_block_num: _Optional[int] = ..., final_blocks_only: _Optional[bool] = ..., production_mode: _Optional[bool] = ..., output_module: _Optional[str] = ..., package: _Optional[_Union[_package_pb2.Package, _Mapping]] = ..., params: _Optional[_Mapping[str, str]] = ..., network: _Optional[str] = ..., debug_initial_store_snapshot_for_modules: _Optional[_Iterable[str]] = ..., noop_mode: _Optional[bool] = ..., limit_processed_blocks: _Optional[int] = ..., dev_output_modules: _Optional[_Iterable[str]] = ..., progress_messages_interval_ms: _Optional[int] = ..., partial_blocks: _Optional[bool] = ...) -> None: ...
