"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getModule = getModule;
exports.getModuleOrThrow = getModuleOrThrow;
function getModule(modules, name) {
  return modules.find(value => value.name === name);
}
function getModuleOrThrow(modules, name, message = `Module "${name}" not found in substream`) {
  const module = getModule(modules, name);
  if (module === undefined) {
    throw new Error(message);
  }
  return module;
}
//# sourceMappingURL=get-module.js.map