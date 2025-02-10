import { validateModules } from "./validate-modules.js";
import { validatePackage } from "./validate-package.js";
export function validatePackageAndModules(pkg, options) {
  validatePackage(pkg, options);
  // biome-ignore lint/style/noNonNullAssertion: existence of `pkg.modules` is checked in `validatePackage`
  validateModules(pkg.modules);
}
//# sourceMappingURL=validate-package-and-modules.js.map