"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProtoTypeName = getProtoTypeName;
function getProtoTypeName(typeName) {
  if (typeName.startsWith("proto:")) {
    return typeName.replace(/^proto:/, "");
  }
  return undefined;
}
//# sourceMappingURL=get-proto-type-name.js.map