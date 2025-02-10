"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSubstream = createSubstream;
var _proto = /*#__PURE__*/require("../proto.js");
function createSubstream(value) {
  if (value instanceof ArrayBuffer) {
    return _proto.Package.fromBinary(new Uint8Array(value));
  }
  return _proto.Package.fromBinary(value);
}
//# sourceMappingURL=create-substream.js.map