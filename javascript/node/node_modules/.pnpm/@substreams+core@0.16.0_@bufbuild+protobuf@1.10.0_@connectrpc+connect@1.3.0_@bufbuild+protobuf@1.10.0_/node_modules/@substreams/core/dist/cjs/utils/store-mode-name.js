"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storeModeName = storeModeName;
var _protobuf = /*#__PURE__*/require("@bufbuild/protobuf");
var _proto = /*#__PURE__*/require("../proto.js");
function storeModeName(mode) {
  const info = _protobuf.proto3.getEnumType(_proto.Module_Input_Store_Mode).findNumber(mode);
  if (info === undefined) {
    throw mode.toString().toLowerCase();
  }
  return info.name.toLowerCase();
}
//# sourceMappingURL=store-mode-name.js.map