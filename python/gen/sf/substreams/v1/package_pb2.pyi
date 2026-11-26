from google.protobuf import any_pb2 as _any_pb2
from google.protobuf import descriptor_pb2 as _descriptor_pb2
from sf.substreams.v1 import modules_pb2 as _modules_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class Package(_message.Message):
    __slots__ = ("proto_files", "version", "modules", "module_meta", "package_meta", "network", "sink_config", "sink_module", "image", "networks", "block_filters")
    class NetworksEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: NetworkParams
        def __init__(self, key: _Optional[str] = ..., value: _Optional[_Union[NetworkParams, _Mapping]] = ...) -> None: ...
    class BlockFiltersEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    PROTO_FILES_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    MODULES_FIELD_NUMBER: _ClassVar[int]
    MODULE_META_FIELD_NUMBER: _ClassVar[int]
    PACKAGE_META_FIELD_NUMBER: _ClassVar[int]
    NETWORK_FIELD_NUMBER: _ClassVar[int]
    SINK_CONFIG_FIELD_NUMBER: _ClassVar[int]
    SINK_MODULE_FIELD_NUMBER: _ClassVar[int]
    IMAGE_FIELD_NUMBER: _ClassVar[int]
    NETWORKS_FIELD_NUMBER: _ClassVar[int]
    BLOCK_FILTERS_FIELD_NUMBER: _ClassVar[int]
    proto_files: _containers.RepeatedCompositeFieldContainer[_descriptor_pb2.FileDescriptorProto]
    version: int
    modules: _modules_pb2.Modules
    module_meta: _containers.RepeatedCompositeFieldContainer[ModuleMetadata]
    package_meta: _containers.RepeatedCompositeFieldContainer[PackageMetadata]
    network: str
    sink_config: _any_pb2.Any
    sink_module: str
    image: bytes
    networks: _containers.MessageMap[str, NetworkParams]
    block_filters: _containers.ScalarMap[str, str]
    def __init__(self, proto_files: _Optional[_Iterable[_Union[_descriptor_pb2.FileDescriptorProto, _Mapping]]] = ..., version: _Optional[int] = ..., modules: _Optional[_Union[_modules_pb2.Modules, _Mapping]] = ..., module_meta: _Optional[_Iterable[_Union[ModuleMetadata, _Mapping]]] = ..., package_meta: _Optional[_Iterable[_Union[PackageMetadata, _Mapping]]] = ..., network: _Optional[str] = ..., sink_config: _Optional[_Union[_any_pb2.Any, _Mapping]] = ..., sink_module: _Optional[str] = ..., image: _Optional[bytes] = ..., networks: _Optional[_Mapping[str, NetworkParams]] = ..., block_filters: _Optional[_Mapping[str, str]] = ...) -> None: ...

class NetworkParams(_message.Message):
    __slots__ = ("initialBlocks", "params")
    class InitialBlocksEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: int
        def __init__(self, key: _Optional[str] = ..., value: _Optional[int] = ...) -> None: ...
    class ParamsEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    INITIALBLOCKS_FIELD_NUMBER: _ClassVar[int]
    PARAMS_FIELD_NUMBER: _ClassVar[int]
    initialBlocks: _containers.ScalarMap[str, int]
    params: _containers.ScalarMap[str, str]
    def __init__(self, initialBlocks: _Optional[_Mapping[str, int]] = ..., params: _Optional[_Mapping[str, str]] = ...) -> None: ...

class PackageMetadata(_message.Message):
    __slots__ = ("version", "url", "name", "doc", "description")
    VERSION_FIELD_NUMBER: _ClassVar[int]
    URL_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    DOC_FIELD_NUMBER: _ClassVar[int]
    DESCRIPTION_FIELD_NUMBER: _ClassVar[int]
    version: str
    url: str
    name: str
    doc: str
    description: str
    def __init__(self, version: _Optional[str] = ..., url: _Optional[str] = ..., name: _Optional[str] = ..., doc: _Optional[str] = ..., description: _Optional[str] = ...) -> None: ...

class ModuleMetadata(_message.Message):
    __slots__ = ("package_index", "doc")
    PACKAGE_INDEX_FIELD_NUMBER: _ClassVar[int]
    DOC_FIELD_NUMBER: _ClassVar[int]
    package_index: int
    doc: str
    def __init__(self, package_index: _Optional[int] = ..., doc: _Optional[str] = ...) -> None: ...
