import type { Module, Modules } from "../../proto.js";
import { ModuleGraph } from "../graph/create-module-graph.js";
export declare function createModuleHashHex(modules: Modules, module: Module, graph?: ModuleGraph): Promise<string>;
export declare function createModuleHashHex(modules: Modules, name: string, graph?: ModuleGraph): Promise<string>;
export declare function createModuleHashHex(modules: Modules, moduleOrName: Module | string, graph?: ModuleGraph): Promise<string>;
export declare function createModuleHash(modules: Modules, module: Module, graph?: ModuleGraph): Promise<Uint8Array>;
export declare function createModuleHash(modules: Modules, name: string, graph?: ModuleGraph): Promise<Uint8Array>;
export declare function createModuleHash(modules: Modules, moduleOrName: Module | string, graph?: ModuleGraph): Promise<Uint8Array>;
//# sourceMappingURL=create-module-hash.d.ts.map