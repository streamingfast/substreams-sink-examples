# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: sf/substreams/solana/type/v1/account.proto
# Protobuf Python Version: 5.28.2
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(
    _runtime_version.Domain.PUBLIC,
    5,
    28,
    2,
    '',
    'sf/substreams/solana/type/v1/account.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from google.protobuf import timestamp_pb2 as google_dot_protobuf_dot_timestamp__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n*sf/substreams/solana/type/v1/account.proto\x12\x1csf.substreams.solana.type.v1\x1a\x1fgoogle/protobuf/timestamp.proto\"U\n\x10\x46ilteredAccounts\x12\x41\n\x08\x61\x63\x63ounts\x18\x01 \x03(\x0b\x32%.sf.substreams.solana.type.v1.AccountR\x08\x61\x63\x63ounts\"\xf5\x01\n\x0c\x41\x63\x63ountBlock\x12\x12\n\x04slot\x18\x01 \x02(\x04R\x04slot\x12\x12\n\x04hash\x18\x02 \x02(\tR\x04hash\x12\x1f\n\x0bparent_slot\x18\x03 \x02(\x04R\nparentSlot\x12\x1f\n\x0bparent_hash\x18\x04 \x02(\tR\nparentHash\x12\x38\n\ttimestamp\x18\x06 \x02(\x0b\x32\x1a.google.protobuf.TimestampR\ttimestamp\x12\x41\n\x08\x61\x63\x63ounts\x18\x07 \x02(\x0b\x32%.sf.substreams.solana.type.v1.AccountR\x08\x61\x63\x63ounts\"g\n\x07\x41\x63\x63ount\x12\x18\n\x07\x61\x64\x64ress\x18\x01 \x02(\x0cR\x07\x61\x64\x64ress\x12\x14\n\x05owner\x18\x02 \x02(\x0cR\x05owner\x12\x12\n\x04\x64\x61ta\x18\x03 \x02(\x0cR\x04\x64\x61ta\x12\x18\n\x07\x64\x65leted\x18\x07 \x02(\x08R\x07\x64\x65letedB\xc5\x01\n com.sf.substreams.solana.type.v1B\x0c\x41\x63\x63ountProtoP\x01\xa2\x02\x04SSST\xaa\x02\x1cSf.Substreams.Solana.Type.V1\xca\x02\x1cSf\\Substreams\\Solana\\Type\\V1\xe2\x02(Sf\\Substreams\\Solana\\Type\\V1\\GPBMetadata\xea\x02 Sf::Substreams::Solana::Type::V1')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'sf.substreams.solana.type.v1.account_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  _globals['DESCRIPTOR']._loaded_options = None
  _globals['DESCRIPTOR']._serialized_options = b'\n com.sf.substreams.solana.type.v1B\014AccountProtoP\001\242\002\004SSST\252\002\034Sf.Substreams.Solana.Type.V1\312\002\034Sf\\Substreams\\Solana\\Type\\V1\342\002(Sf\\Substreams\\Solana\\Type\\V1\\GPBMetadata\352\002 Sf::Substreams::Solana::Type::V1'
  _globals['_FILTEREDACCOUNTS']._serialized_start=109
  _globals['_FILTEREDACCOUNTS']._serialized_end=194
  _globals['_ACCOUNTBLOCK']._serialized_start=197
  _globals['_ACCOUNTBLOCK']._serialized_end=442
  _globals['_ACCOUNT']._serialized_start=444
  _globals['_ACCOUNT']._serialized_end=547
# @@protoc_insertion_point(module_scope)
