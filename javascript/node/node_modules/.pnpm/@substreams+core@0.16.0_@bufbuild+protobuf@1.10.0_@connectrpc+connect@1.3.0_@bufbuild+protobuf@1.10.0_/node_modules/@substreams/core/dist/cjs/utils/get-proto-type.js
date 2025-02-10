"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProtoType = getProtoType;
exports.getProtoTypeOrThrow = getProtoTypeOrThrow;
var _getProtoTypeName = /*#__PURE__*/require("./get-proto-type-name.js");
function getProtoType(typeName, registry) {
  const protoTypeName = (0, _getProtoTypeName.getProtoTypeName)(typeName);
  if (protoTypeName === undefined) {
    return undefined;
  }
  return registry.findMessage(protoTypeName);
}
function getProtoTypeOrThrow(typeName, registry, message = `Type "${typeName}" not found in registry`) {
  const type = getProtoType(typeName, registry);
  if (type === undefined) {
    throw new Error(message);
  }
  return type;
}
//# sourceMappingURL=get-proto-type.js.map