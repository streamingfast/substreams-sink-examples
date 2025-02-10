"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRegistry = createRegistry;
var _protobuf = /*#__PURE__*/require("@bufbuild/protobuf");
function createRegistry(substream) {
  return (0, _protobuf.createRegistryFromDescriptors)((0, _protobuf.createDescriptorSet)(substream.protoFiles), true);
}
//# sourceMappingURL=create-registry.js.map