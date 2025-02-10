import type { Module } from "../proto.js";
export type MapModule = Module & {
    kind: {
        case: "kindMap";
    };
};
export declare function isMapModule(module: Module): module is MapModule;
//# sourceMappingURL=is-map-module.d.ts.map