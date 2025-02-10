import type { Modules, Package } from "../../proto.js";
export declare const nameRegExp: RegExp;
export declare const semverRegExp: RegExp;
export type ValidatePackageOptions = {
    skipModuleOutputTypeValidation?: boolean | undefined;
};
export type ValidPackage = Package & {
    modules: Modules;
};
export declare function validatePackage(pkg: Package, { skipModuleOutputTypeValidation }?: ValidatePackageOptions): asserts pkg is ValidPackage;
//# sourceMappingURL=validate-package.d.ts.map