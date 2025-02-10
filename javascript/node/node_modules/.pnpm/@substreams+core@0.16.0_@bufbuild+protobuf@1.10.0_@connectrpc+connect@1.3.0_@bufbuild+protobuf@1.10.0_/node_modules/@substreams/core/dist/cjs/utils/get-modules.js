"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getModules = getModules;
var _isMapModule = /*#__PURE__*/require("./is-map-module.js");
var _isStoreModule = /*#__PURE__*/require("./is-store-module.js");
function getModules(substream, kind = "both") {
  const modules = substream.modules?.modules ?? [];
  if (kind === "both") {
    return modules.filter(module => (0, _isMapModule.isMapModule)(module) || (0, _isStoreModule.isStoreModule)(module));
  }
  if (kind === "map") {
    return modules.filter(module => (0, _isMapModule.isMapModule)(module));
  }
  if (kind === "store") {
    return modules.filter(module => (0, _isStoreModule.isStoreModule)(module));
  }
  throw new Error(`Invalid module kind ${kind}`);
}
//# sourceMappingURL=get-modules.js.map