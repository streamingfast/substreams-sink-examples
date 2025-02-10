"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRequest = createRequest;
var _createModuleGraph = /*#__PURE__*/require("../manifest/graph/create-module-graph.js");
var _proto = /*#__PURE__*/require("../proto.js");
var _getModule = /*#__PURE__*/require("./get-module.js");
function createRequest({
  substreamPackage,
  outputModule,
  startBlockNum,
  stopBlockNum = BigInt(0),
  productionMode,
  startCursor,
  finalBlocksOnly,
  debugInitialStoreSnapshotForModules
}) {
  const resolvedOutputModule = resolveOutputModule(substreamPackage, outputModule);
  const packageModules = substreamPackage.modules;
  if (packageModules === undefined) {
    throw new Error("Substream package does not contain any modules.");
  }
  const moduleGraph = (0, _createModuleGraph.createModuleGraph)(packageModules.modules);
  const requestModules = resolveRequestModules(moduleGraph, packageModules, resolvedOutputModule);
  const resolvedStartBlockNum = resolveStartBlockNum(moduleGraph, resolvedOutputModule, startBlockNum);
  const resolvedStopBlockNum = resolveStopBlockNum(resolvedStartBlockNum, stopBlockNum);
  return new _proto.Request({
    modules: requestModules,
    startBlockNum: resolvedStartBlockNum,
    stopBlockNum: resolvedStopBlockNum,
    outputModule: resolvedOutputModule.name,
    productionMode: productionMode ?? false,
    finalBlocksOnly: finalBlocksOnly ?? false,
    debugInitialStoreSnapshotForModules: debugInitialStoreSnapshotForModules ?? [],
    ...(startCursor !== undefined ? {
      startCursor
    } : undefined)
  });
}
function resolveRequestModules(moduleGraph, packageModules, outputModule) {
  const requestModules = new _proto.Modules();
  const requiredModules = [outputModule, ...moduleGraph.ancestorsOf(outputModule)];
  for (const module of requiredModules) {
    const moduleBinary = packageModules.binaries[module.binaryIndex];
    if (moduleBinary === undefined) {
      throw new Error(`Missing ${module.name} module binary at index ${module.binaryIndex}`);
    }
    let binaryIndex = requestModules.binaries.indexOf(moduleBinary);
    if (binaryIndex === -1) {
      binaryIndex = requestModules.binaries.push(moduleBinary) - 1;
    }
    requestModules.modules.push(new _proto.Module({
      ...module,
      binaryIndex
    }));
  }
  return requestModules;
}
function resolveStartBlockNum(moduleGraph, outputModule, startBlockNum) {
  if (startBlockNum === undefined) {
    return moduleGraph.startBlockFor(outputModule);
  }
  const startBlockBi = BigInt(startBlockNum);
  // If the start block is specified & non-relative, make sure it's not before the start block of the output module.
  if (startBlockBi > BigInt(0)) {
    const moduleStartBlock = moduleGraph.startBlockFor(outputModule);
    if (moduleStartBlock > startBlockBi) {
      throw new Error(`Given start block ${startBlockBi} is before the modules initial block (${moduleStartBlock})`);
    }
  }
  return startBlockBi;
}
function resolveOutputModule(substreamPackage, outputModule) {
  if (typeof outputModule === "string") {
    if (substreamPackage.modules === undefined) {
      throw new Error("Substream package does not contain any modules.");
    }
    return (0, _getModule.getModuleOrThrow)(substreamPackage.modules?.modules ?? [], outputModule);
  }
  return outputModule;
}
function resolveStopBlockNum(startBlockNum, stopBlockNum) {
  if (typeof stopBlockNum === "string" && stopBlockNum.startsWith("+")) {
    if (startBlockNum < BigInt(0)) {
      throw new Error("A relative stop block number is only supported with an absolute start block number.");
    }
    return startBlockNum + BigInt(stopBlockNum.slice(1));
  }
  return BigInt(stopBlockNum);
}
//# sourceMappingURL=create-request.js.map