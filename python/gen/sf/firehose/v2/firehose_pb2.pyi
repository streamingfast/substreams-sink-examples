import datetime

from google.protobuf import any_pb2 as _any_pb2
from google.protobuf import timestamp_pb2 as _timestamp_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class ForkStep(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    STEP_UNSET: _ClassVar[ForkStep]
    STEP_NEW: _ClassVar[ForkStep]
    STEP_UNDO: _ClassVar[ForkStep]
    STEP_FINAL: _ClassVar[ForkStep]
STEP_UNSET: ForkStep
STEP_NEW: ForkStep
STEP_UNDO: ForkStep
STEP_FINAL: ForkStep

class SingleBlockRequest(_message.Message):
    __slots__ = ("block_number", "block_hash_and_number", "cursor", "transforms")
    class BlockNumber(_message.Message):
        __slots__ = ("num",)
        NUM_FIELD_NUMBER: _ClassVar[int]
        num: int
        def __init__(self, num: _Optional[int] = ...) -> None: ...
    class BlockHashAndNumber(_message.Message):
        __slots__ = ("num", "hash")
        NUM_FIELD_NUMBER: _ClassVar[int]
        HASH_FIELD_NUMBER: _ClassVar[int]
        num: int
        hash: str
        def __init__(self, num: _Optional[int] = ..., hash: _Optional[str] = ...) -> None: ...
    class Cursor(_message.Message):
        __slots__ = ("cursor",)
        CURSOR_FIELD_NUMBER: _ClassVar[int]
        cursor: str
        def __init__(self, cursor: _Optional[str] = ...) -> None: ...
    BLOCK_NUMBER_FIELD_NUMBER: _ClassVar[int]
    BLOCK_HASH_AND_NUMBER_FIELD_NUMBER: _ClassVar[int]
    CURSOR_FIELD_NUMBER: _ClassVar[int]
    TRANSFORMS_FIELD_NUMBER: _ClassVar[int]
    block_number: SingleBlockRequest.BlockNumber
    block_hash_and_number: SingleBlockRequest.BlockHashAndNumber
    cursor: SingleBlockRequest.Cursor
    transforms: _containers.RepeatedCompositeFieldContainer[_any_pb2.Any]
    def __init__(self, block_number: _Optional[_Union[SingleBlockRequest.BlockNumber, _Mapping]] = ..., block_hash_and_number: _Optional[_Union[SingleBlockRequest.BlockHashAndNumber, _Mapping]] = ..., cursor: _Optional[_Union[SingleBlockRequest.Cursor, _Mapping]] = ..., transforms: _Optional[_Iterable[_Union[_any_pb2.Any, _Mapping]]] = ...) -> None: ...

class SingleBlockResponse(_message.Message):
    __slots__ = ("block", "metadata")
    BLOCK_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    block: _any_pb2.Any
    metadata: BlockMetadata
    def __init__(self, block: _Optional[_Union[_any_pb2.Any, _Mapping]] = ..., metadata: _Optional[_Union[BlockMetadata, _Mapping]] = ...) -> None: ...

class Request(_message.Message):
    __slots__ = ("start_block_num", "cursor", "stop_block_num", "final_blocks_only", "transforms")
    START_BLOCK_NUM_FIELD_NUMBER: _ClassVar[int]
    CURSOR_FIELD_NUMBER: _ClassVar[int]
    STOP_BLOCK_NUM_FIELD_NUMBER: _ClassVar[int]
    FINAL_BLOCKS_ONLY_FIELD_NUMBER: _ClassVar[int]
    TRANSFORMS_FIELD_NUMBER: _ClassVar[int]
    start_block_num: int
    cursor: str
    stop_block_num: int
    final_blocks_only: bool
    transforms: _containers.RepeatedCompositeFieldContainer[_any_pb2.Any]
    def __init__(self, start_block_num: _Optional[int] = ..., cursor: _Optional[str] = ..., stop_block_num: _Optional[int] = ..., final_blocks_only: _Optional[bool] = ..., transforms: _Optional[_Iterable[_Union[_any_pb2.Any, _Mapping]]] = ...) -> None: ...

class Response(_message.Message):
    __slots__ = ("block", "step", "cursor", "metadata")
    BLOCK_FIELD_NUMBER: _ClassVar[int]
    STEP_FIELD_NUMBER: _ClassVar[int]
    CURSOR_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    block: _any_pb2.Any
    step: ForkStep
    cursor: str
    metadata: BlockMetadata
    def __init__(self, block: _Optional[_Union[_any_pb2.Any, _Mapping]] = ..., step: _Optional[_Union[ForkStep, str]] = ..., cursor: _Optional[str] = ..., metadata: _Optional[_Union[BlockMetadata, _Mapping]] = ...) -> None: ...

class BlockMetadata(_message.Message):
    __slots__ = ("num", "id", "parent_num", "parent_id", "lib_num", "time")
    NUM_FIELD_NUMBER: _ClassVar[int]
    ID_FIELD_NUMBER: _ClassVar[int]
    PARENT_NUM_FIELD_NUMBER: _ClassVar[int]
    PARENT_ID_FIELD_NUMBER: _ClassVar[int]
    LIB_NUM_FIELD_NUMBER: _ClassVar[int]
    TIME_FIELD_NUMBER: _ClassVar[int]
    num: int
    id: str
    parent_num: int
    parent_id: str
    lib_num: int
    time: _timestamp_pb2.Timestamp
    def __init__(self, num: _Optional[int] = ..., id: _Optional[str] = ..., parent_num: _Optional[int] = ..., parent_id: _Optional[str] = ..., lib_num: _Optional[int] = ..., time: _Optional[_Union[datetime.datetime, _timestamp_pb2.Timestamp, _Mapping]] = ...) -> None: ...

class InfoRequest(_message.Message):
    __slots__ = ()
    def __init__(self) -> None: ...

class InfoResponse(_message.Message):
    __slots__ = ("chain_name", "chain_name_aliases", "first_streamable_block_num", "first_streamable_block_id", "block_id_encoding", "block_features")
    class BlockIdEncoding(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
        __slots__ = ()
        BLOCK_ID_ENCODING_UNSET: _ClassVar[InfoResponse.BlockIdEncoding]
        BLOCK_ID_ENCODING_HEX: _ClassVar[InfoResponse.BlockIdEncoding]
        BLOCK_ID_ENCODING_0X_HEX: _ClassVar[InfoResponse.BlockIdEncoding]
        BLOCK_ID_ENCODING_BASE58: _ClassVar[InfoResponse.BlockIdEncoding]
        BLOCK_ID_ENCODING_BASE64: _ClassVar[InfoResponse.BlockIdEncoding]
        BLOCK_ID_ENCODING_BASE64URL: _ClassVar[InfoResponse.BlockIdEncoding]
    BLOCK_ID_ENCODING_UNSET: InfoResponse.BlockIdEncoding
    BLOCK_ID_ENCODING_HEX: InfoResponse.BlockIdEncoding
    BLOCK_ID_ENCODING_0X_HEX: InfoResponse.BlockIdEncoding
    BLOCK_ID_ENCODING_BASE58: InfoResponse.BlockIdEncoding
    BLOCK_ID_ENCODING_BASE64: InfoResponse.BlockIdEncoding
    BLOCK_ID_ENCODING_BASE64URL: InfoResponse.BlockIdEncoding
    CHAIN_NAME_FIELD_NUMBER: _ClassVar[int]
    CHAIN_NAME_ALIASES_FIELD_NUMBER: _ClassVar[int]
    FIRST_STREAMABLE_BLOCK_NUM_FIELD_NUMBER: _ClassVar[int]
    FIRST_STREAMABLE_BLOCK_ID_FIELD_NUMBER: _ClassVar[int]
    BLOCK_ID_ENCODING_FIELD_NUMBER: _ClassVar[int]
    BLOCK_FEATURES_FIELD_NUMBER: _ClassVar[int]
    chain_name: str
    chain_name_aliases: _containers.RepeatedScalarFieldContainer[str]
    first_streamable_block_num: int
    first_streamable_block_id: str
    block_id_encoding: InfoResponse.BlockIdEncoding
    block_features: _containers.RepeatedScalarFieldContainer[str]
    def __init__(self, chain_name: _Optional[str] = ..., chain_name_aliases: _Optional[_Iterable[str]] = ..., first_streamable_block_num: _Optional[int] = ..., first_streamable_block_id: _Optional[str] = ..., block_id_encoding: _Optional[_Union[InfoResponse.BlockIdEncoding, str]] = ..., block_features: _Optional[_Iterable[str]] = ...) -> None: ...
