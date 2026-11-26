from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class Modules(_message.Message):
    __slots__ = ("modules", "binaries")
    MODULES_FIELD_NUMBER: _ClassVar[int]
    BINARIES_FIELD_NUMBER: _ClassVar[int]
    modules: _containers.RepeatedCompositeFieldContainer[Module]
    binaries: _containers.RepeatedCompositeFieldContainer[Binary]
    def __init__(self, modules: _Optional[_Iterable[_Union[Module, _Mapping]]] = ..., binaries: _Optional[_Iterable[_Union[Binary, _Mapping]]] = ...) -> None: ...

class Binary(_message.Message):
    __slots__ = ("type", "content")
    TYPE_FIELD_NUMBER: _ClassVar[int]
    CONTENT_FIELD_NUMBER: _ClassVar[int]
    type: str
    content: bytes
    def __init__(self, type: _Optional[str] = ..., content: _Optional[bytes] = ...) -> None: ...

class Module(_message.Message):
    __slots__ = ("name", "kind_map", "kind_store", "kind_block_index", "binary_index", "binary_entrypoint", "inputs", "output", "initial_block", "block_filter")
    class BlockFilter(_message.Message):
        __slots__ = ("module", "query_string", "query_from_params")
        MODULE_FIELD_NUMBER: _ClassVar[int]
        QUERY_STRING_FIELD_NUMBER: _ClassVar[int]
        QUERY_FROM_PARAMS_FIELD_NUMBER: _ClassVar[int]
        module: str
        query_string: str
        query_from_params: Module.QueryFromParams
        def __init__(self, module: _Optional[str] = ..., query_string: _Optional[str] = ..., query_from_params: _Optional[_Union[Module.QueryFromParams, _Mapping]] = ...) -> None: ...
    class QueryFromParams(_message.Message):
        __slots__ = ()
        def __init__(self) -> None: ...
    class KindMap(_message.Message):
        __slots__ = ("output_type",)
        OUTPUT_TYPE_FIELD_NUMBER: _ClassVar[int]
        output_type: str
        def __init__(self, output_type: _Optional[str] = ...) -> None: ...
    class KindStore(_message.Message):
        __slots__ = ("update_policy", "value_type")
        class UpdatePolicy(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
            __slots__ = ()
            UPDATE_POLICY_UNSET: _ClassVar[Module.KindStore.UpdatePolicy]
            UPDATE_POLICY_SET: _ClassVar[Module.KindStore.UpdatePolicy]
            UPDATE_POLICY_SET_IF_NOT_EXISTS: _ClassVar[Module.KindStore.UpdatePolicy]
            UPDATE_POLICY_ADD: _ClassVar[Module.KindStore.UpdatePolicy]
            UPDATE_POLICY_MIN: _ClassVar[Module.KindStore.UpdatePolicy]
            UPDATE_POLICY_MAX: _ClassVar[Module.KindStore.UpdatePolicy]
            UPDATE_POLICY_APPEND: _ClassVar[Module.KindStore.UpdatePolicy]
            UPDATE_POLICY_SET_SUM: _ClassVar[Module.KindStore.UpdatePolicy]
        UPDATE_POLICY_UNSET: Module.KindStore.UpdatePolicy
        UPDATE_POLICY_SET: Module.KindStore.UpdatePolicy
        UPDATE_POLICY_SET_IF_NOT_EXISTS: Module.KindStore.UpdatePolicy
        UPDATE_POLICY_ADD: Module.KindStore.UpdatePolicy
        UPDATE_POLICY_MIN: Module.KindStore.UpdatePolicy
        UPDATE_POLICY_MAX: Module.KindStore.UpdatePolicy
        UPDATE_POLICY_APPEND: Module.KindStore.UpdatePolicy
        UPDATE_POLICY_SET_SUM: Module.KindStore.UpdatePolicy
        UPDATE_POLICY_FIELD_NUMBER: _ClassVar[int]
        VALUE_TYPE_FIELD_NUMBER: _ClassVar[int]
        update_policy: Module.KindStore.UpdatePolicy
        value_type: str
        def __init__(self, update_policy: _Optional[_Union[Module.KindStore.UpdatePolicy, str]] = ..., value_type: _Optional[str] = ...) -> None: ...
    class KindBlockIndex(_message.Message):
        __slots__ = ("output_type",)
        OUTPUT_TYPE_FIELD_NUMBER: _ClassVar[int]
        output_type: str
        def __init__(self, output_type: _Optional[str] = ...) -> None: ...
    class FoundationalStore(_message.Message):
        __slots__ = ("identifier",)
        IDENTIFIER_FIELD_NUMBER: _ClassVar[int]
        identifier: str
        def __init__(self, identifier: _Optional[str] = ...) -> None: ...
    class Input(_message.Message):
        __slots__ = ("source", "map", "store", "params", "foundational_store")
        class Source(_message.Message):
            __slots__ = ("type",)
            TYPE_FIELD_NUMBER: _ClassVar[int]
            type: str
            def __init__(self, type: _Optional[str] = ...) -> None: ...
        class Map(_message.Message):
            __slots__ = ("module_name",)
            MODULE_NAME_FIELD_NUMBER: _ClassVar[int]
            module_name: str
            def __init__(self, module_name: _Optional[str] = ...) -> None: ...
        class Store(_message.Message):
            __slots__ = ("module_name", "mode")
            class Mode(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
                __slots__ = ()
                UNSET: _ClassVar[Module.Input.Store.Mode]
                GET: _ClassVar[Module.Input.Store.Mode]
                DELTAS: _ClassVar[Module.Input.Store.Mode]
            UNSET: Module.Input.Store.Mode
            GET: Module.Input.Store.Mode
            DELTAS: Module.Input.Store.Mode
            MODULE_NAME_FIELD_NUMBER: _ClassVar[int]
            MODE_FIELD_NUMBER: _ClassVar[int]
            module_name: str
            mode: Module.Input.Store.Mode
            def __init__(self, module_name: _Optional[str] = ..., mode: _Optional[_Union[Module.Input.Store.Mode, str]] = ...) -> None: ...
        class Params(_message.Message):
            __slots__ = ("value",)
            VALUE_FIELD_NUMBER: _ClassVar[int]
            value: str
            def __init__(self, value: _Optional[str] = ...) -> None: ...
        SOURCE_FIELD_NUMBER: _ClassVar[int]
        MAP_FIELD_NUMBER: _ClassVar[int]
        STORE_FIELD_NUMBER: _ClassVar[int]
        PARAMS_FIELD_NUMBER: _ClassVar[int]
        FOUNDATIONAL_STORE_FIELD_NUMBER: _ClassVar[int]
        source: Module.Input.Source
        map: Module.Input.Map
        store: Module.Input.Store
        params: Module.Input.Params
        foundational_store: Module.FoundationalStore
        def __init__(self, source: _Optional[_Union[Module.Input.Source, _Mapping]] = ..., map: _Optional[_Union[Module.Input.Map, _Mapping]] = ..., store: _Optional[_Union[Module.Input.Store, _Mapping]] = ..., params: _Optional[_Union[Module.Input.Params, _Mapping]] = ..., foundational_store: _Optional[_Union[Module.FoundationalStore, _Mapping]] = ...) -> None: ...
    class Output(_message.Message):
        __slots__ = ("type",)
        TYPE_FIELD_NUMBER: _ClassVar[int]
        type: str
        def __init__(self, type: _Optional[str] = ...) -> None: ...
    NAME_FIELD_NUMBER: _ClassVar[int]
    KIND_MAP_FIELD_NUMBER: _ClassVar[int]
    KIND_STORE_FIELD_NUMBER: _ClassVar[int]
    KIND_BLOCK_INDEX_FIELD_NUMBER: _ClassVar[int]
    BINARY_INDEX_FIELD_NUMBER: _ClassVar[int]
    BINARY_ENTRYPOINT_FIELD_NUMBER: _ClassVar[int]
    INPUTS_FIELD_NUMBER: _ClassVar[int]
    OUTPUT_FIELD_NUMBER: _ClassVar[int]
    INITIAL_BLOCK_FIELD_NUMBER: _ClassVar[int]
    BLOCK_FILTER_FIELD_NUMBER: _ClassVar[int]
    name: str
    kind_map: Module.KindMap
    kind_store: Module.KindStore
    kind_block_index: Module.KindBlockIndex
    binary_index: int
    binary_entrypoint: str
    inputs: _containers.RepeatedCompositeFieldContainer[Module.Input]
    output: Module.Output
    initial_block: int
    block_filter: Module.BlockFilter
    def __init__(self, name: _Optional[str] = ..., kind_map: _Optional[_Union[Module.KindMap, _Mapping]] = ..., kind_store: _Optional[_Union[Module.KindStore, _Mapping]] = ..., kind_block_index: _Optional[_Union[Module.KindBlockIndex, _Mapping]] = ..., binary_index: _Optional[int] = ..., binary_entrypoint: _Optional[str] = ..., inputs: _Optional[_Iterable[_Union[Module.Input, _Mapping]]] = ..., output: _Optional[_Union[Module.Output, _Mapping]] = ..., initial_block: _Optional[int] = ..., block_filter: _Optional[_Union[Module.BlockFilter, _Mapping]] = ...) -> None: ...
