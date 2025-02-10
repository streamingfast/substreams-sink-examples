import type { Module } from "../proto.js";
export type StoreModule = Module & {
    kind: {
        case: "kindStore";
    };
};
export declare function isStoreModule(module: Module): module is StoreModule;
//# sourceMappingURL=is-store-module.d.ts.map