"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOutputType = getOutputType;
var _getProtoType = /*#__PURE__*/require("./get-proto-type.js");
var _isMapModule = /*#__PURE__*/require("./is-map-module.js");
function getOutputType(module, registry) {
  if (!(0, _isMapModule.isMapModule)(module)) {
    return undefined;
  }
  return (0, _getProtoType.getProtoType)(module.kind.value.outputType, registry);
}
//# sourceMappingURL=get-output-type.js.map