from google.protobuf import any_pb2 as _any_pb2
from sf.firehose.v2 import firehose_pb2 as _firehose_pb2
from sf.substreams.rpc.v2 import service_pb2 as _service_pb2
from sf.substreams.rpc.v3 import service_pb2 as _service_pb2_1
from sf.substreams.v1 import clock_pb2 as _clock_pb2
from sf.substreams.v1 import modules_pb2 as _modules_pb2
from sf.substreams.v1 import package_pb2 as _package_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class Response(_message.Message):
    __slots__ = ("session", "progress", "block_scoped_datas", "block_undo_signal", "fatal_error", "debug_snapshot_data", "debug_snapshot_complete")
    SESSION_FIELD_NUMBER: _ClassVar[int]
    PROGRESS_FIELD_NUMBER: _ClassVar[int]
    BLOCK_SCOPED_DATAS_FIELD_NUMBER: _ClassVar[int]
    BLOCK_UNDO_SIGNAL_FIELD_NUMBER: _ClassVar[int]
    FATAL_ERROR_FIELD_NUMBER: _ClassVar[int]
    DEBUG_SNAPSHOT_DATA_FIELD_NUMBER: _ClassVar[int]
    DEBUG_SNAPSHOT_COMPLETE_FIELD_NUMBER: _ClassVar[int]
    session: _service_pb2.SessionInit
    progress: _service_pb2.ModulesProgress
    block_scoped_datas: BlockScopedDatas
    block_undo_signal: _service_pb2.BlockUndoSignal
    fatal_error: _service_pb2.Error
    debug_snapshot_data: _service_pb2.InitialSnapshotData
    debug_snapshot_complete: _service_pb2.InitialSnapshotComplete
    def __init__(self, session: _Optional[_Union[_service_pb2.SessionInit, _Mapping]] = ..., progress: _Optional[_Union[_service_pb2.ModulesProgress, _Mapping]] = ..., block_scoped_datas: _Optional[_Union[BlockScopedDatas, _Mapping]] = ..., block_undo_signal: _Optional[_Union[_service_pb2.BlockUndoSignal, _Mapping]] = ..., fatal_error: _Optional[_Union[_service_pb2.Error, _Mapping]] = ..., debug_snapshot_data: _Optional[_Union[_service_pb2.InitialSnapshotData, _Mapping]] = ..., debug_snapshot_complete: _Optional[_Union[_service_pb2.InitialSnapshotComplete, _Mapping]] = ...) -> None: ...

class BlockScopedDatas(_message.Message):
    __slots__ = ("items",)
    ITEMS_FIELD_NUMBER: _ClassVar[int]
    items: _containers.RepeatedCompositeFieldContainer[_service_pb2.BlockScopedData]
    def __init__(self, items: _Optional[_Iterable[_Union[_service_pb2.BlockScopedData, _Mapping]]] = ...) -> None: ...
