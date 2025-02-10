"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validatePackageAndModules = validatePackageAndModules;
var _validateModules = /*#__PURE__*/require("./validate-modules.js");
var _validatePackage = /*#__PURE__*/require("./validate-package.js");
function validatePackageAndModules(pkg, options) {
  (0, _validatePackage.validatePackage)(pkg, options);
  // biome-ignore lint/style/noNonNullAssertion: existence of `pkg.modules` is checked in `validatePackage`
  (0, _validateModules.validateModules)(pkg.modules);
}
//# sourceMappingURL=validate-package-and-modules.js.map