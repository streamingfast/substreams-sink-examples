"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateModules = validateModules;
var _proto = /*#__PURE__*/require("../../proto.js");
var _isMapModule = /*#__PURE__*/require("../../utils/is-map-module.js");
var _isStoreModule = /*#__PURE__*/require("../../utils/is-store-module.js");
var _storeModeName = /*#__PURE__*/require("../../utils/store-mode-name.js");
var _validatePackage = /*#__PURE__*/require("./validate-package.js");
function validateModules(modules) {
  const codeSize = modules.binaries.reduce((carry, binary) => carry + binary.content.length, 0);
  if (codeSize > 100000000) {
    throw new Error("Limit of 100MB of module code size reached");
  }
  if (modules.modules.length > 100) {
    throw new Error("Limit of 100 modules reached");
  }
  for (const mod of modules.modules) {
    for (const segment of mod.name.split(":")) {
      if (!_validatePackage.nameRegExp.test(segment)) {
        throw new Error(`Module "${mod.name}": segment "${segment}" does not match regex ${_validatePackage.nameRegExp.toString()}`);
      }
    }
    if (mod.inputs.length > 30) {
      throw new Error(`Limit of 30 inputs for a given module ("${mod.name}") reached`);
    }
    for (const [index, input] of mod.inputs.entries()) {
      if (input.input.case === "params") {
        if (index !== 0) {
          throw new Error(`Module "${mod.name}": input ${index}: params must be first input`);
        }
      } else if (input.input.case === "source") {
        if (!input.input.value.type) {
          throw new Error(`Module "${mod.name}": input ${index}: source type empty`);
        }
      } else if (input.input.case === "map") {
        const seek = input.input.value.moduleName;
        const target = modules.modules.find(inner => inner.name === seek);
        if (target === undefined) {
          throw new Error(`Module "${mod.name}": input ${index}: map input named "${seek}" not found`);
        }
        if (!(0, _isMapModule.isMapModule)(target)) {
          throw new Error(`Module "${mod.name}": input ${index}: referenced module "${seek}" not of 'map' kind`);
        }
      } else if (input.input.case === "store") {
        const seek = input.input.value.moduleName;
        const target = modules.modules.find(inner => inner.name === seek);
        if (target === undefined) {
          throw new Error(`Module "${mod.name}": input ${index}: store input named "${seek}" not found`);
        }
        if (!(0, _isStoreModule.isStoreModule)(target)) {
          throw new Error(`Module "${mod.name}": input ${index}: referenced module "${seek}" not of 'store' kind`);
        }
        switch (input.input.value.mode) {
          case _proto.Module_Input_Store_Mode.GET:
          case _proto.Module_Input_Store_Mode.DELTAS:
            break;
          default:
            {
              const mode = (0, _storeModeName.storeModeName)(input.input.value.mode);
              throw new Error(`Module "${mod.name}": input ${index}: unknown store mode value ${mode}`);
            }
        }
      }
    }
  }
  return null;
}
//# sourceMappingURL=validate-modules.js.map