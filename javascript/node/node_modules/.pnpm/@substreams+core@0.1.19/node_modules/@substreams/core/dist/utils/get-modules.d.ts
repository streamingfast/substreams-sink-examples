import type { Package } from "../proto.js";
import { type MapModule } from "./is-map-module.js";
import { type StoreModule } from "./is-store-module.js";
export type ModuleKind = "map" | "store";
export type ModuleKindOrBoth = ModuleKind | "both";
export type GetModulesReturnType<TKind extends ModuleKindOrBoth = "both"> = TKind extends "map" ? MapModule[] : TKind extends "store" ? StoreModule[] : TKind extends "both" ? (StoreModule | MapModule)[] : never;
export declare function getModules<TKind extends ModuleKindOrBoth = "both">(substream: Package, kind?: TKind): GetModulesReturnType<TKind>;
//# sourceMappingURL=get-modules.d.ts.map