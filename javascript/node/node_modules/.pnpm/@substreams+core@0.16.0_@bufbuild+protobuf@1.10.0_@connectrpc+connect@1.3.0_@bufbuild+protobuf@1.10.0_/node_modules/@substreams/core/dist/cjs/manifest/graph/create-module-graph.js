"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModuleGraph = exports.INITIAL_BLOCK_UNSET = void 0;
exports.createModuleGraph = createModuleGraph;
exports.createModuleNodes = createModuleNodes;
var _getModule = /*#__PURE__*/require("../../utils/get-module.js");
var _assertAcyclic = /*#__PURE__*/require("./assert-acyclic.js");
var _shortestPaths = /*#__PURE__*/require("./shortest-paths.js");
var _topologicalSort = /*#__PURE__*/require("./topological-sort.js");
const INITIAL_BLOCK_UNSET = exports.INITIAL_BLOCK_UNSET = /*#__PURE__*/BigInt("18446744073709551615");
class ModuleGraph {
  modules;
  nodes;
  /**
   * A cache of shortest paths between modules.
   */
  distances = new Map();
  /**
   * A cache of topologically sorted modules.
   */
  sorted = new Map();
  constructor(modules) {
    this.modules = modules;
    this.nodes = createModuleNodes(modules);
  }
  getModule(nameOrModule) {
    return typeof nameOrModule === "string" ? (0, _getModule.getModuleOrThrow)(this.modules, nameOrModule) : nameOrModule;
  }
  shortesPaths(nameOrModule) {
    const module = this.getModule(nameOrModule);
    let distances = this.distances.get(module);
    if (distances === undefined) {
      distances = (0, _shortestPaths.shortestPaths)(this.topologicalSort(module), this.nodes, module);
      this.distances.set(module, distances);
    }
    return distances;
  }
  topologicalSort(nameOrModule) {
    if (nameOrModule !== undefined) {
      const node = this.getModule(nameOrModule);
      let sorted = this.sorted.get(node);
      if (sorted === undefined) {
        sorted = (0, _topologicalSort.topologicalSort)(this.nodes, node);
        this.sorted.set(node, sorted);
      }
      return sorted;
    }
    const merged = new Set();
    for (const single of this.modules.map(module => (0, _topologicalSort.topologicalSort)(this.nodes, module))) {
      for (const node of single) {
        merged.add(node);
      }
    }
    return merged;
  }
  ancestorsOf(nameOrModule) {
    const distances = Array.from(this.shortesPaths(nameOrModule));
    return distances.filter(([, distance]) => distance > 0).map(([node]) => node);
  }
  parentsOf(nameOrModule) {
    const distances = Array.from(this.shortesPaths(nameOrModule));
    return distances.filter(([, distance]) => distance === 1).map(([node]) => node);
  }
  childrenOf(nameOrModule) {
    const module = typeof nameOrModule === "string" ? (0, _getModule.getModuleOrThrow)(this.modules, nameOrModule) : nameOrModule;
    const sorted = this.sortedByGraphTopology();
    const children = new Set();
    for (const current of sorted) {
      const distances = this.shortesPaths(current);
      if (distances.get(module) === 1) {
        children.add(current);
      }
    }
    return Array.from(children);
  }
  sortedByGraphTopology() {
    return Array.from(this.topologicalSort());
  }
  startBlockFor(nameOrModule) {
    const module = typeof nameOrModule === "string" ? (0, _getModule.getModuleOrThrow)(this.modules, nameOrModule) : nameOrModule;
    if (module.initialBlock !== INITIAL_BLOCK_UNSET) {
      return module.initialBlock;
    }
    const ancestors = this.ancestorsOf(module);
    const block = ancestors.reduce((carry, current) => {
      if (current.initialBlock !== INITIAL_BLOCK_UNSET && current.initialBlock < carry) {
        return current.initialBlock;
      }
      return carry;
    }, INITIAL_BLOCK_UNSET);
    return block === INITIAL_BLOCK_UNSET ? BigInt(0) : block;
  }
}
exports.ModuleGraph = ModuleGraph;
function createModuleNodes(modules) {
  const nodes = new Map();
  for (const module of modules) {
    const existing = nodes.get(module);
    if (existing !== undefined) {
      throw new Error(`Duplicate module ${module.name}`);
    }
    nodes.set(module, new Set());
  }
  for (const module of modules) {
    // biome-ignore lint/style/noNonNullAssertion: guarenteed at this point.
    const adjacents = nodes.get(module);
    for (const input of module.inputs) {
      if (input.input.case === "map" || input.input.case === "store") {
        const incoming = (0, _getModule.getModuleOrThrow)(modules, input.input.value.moduleName);
        adjacents.add(incoming);
      }
    }
  }
  (0, _assertAcyclic.assertAcyclic)(nodes);
  return nodes;
}
function createModuleGraph(modules) {
  return new ModuleGraph(modules);
}
//# sourceMappingURL=create-module-graph.js.map