"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.streamBlocks = streamBlocks;
var _connect = /*#__PURE__*/require("@connectrpc/connect");
var _proto = /*#__PURE__*/require("../proto.js");
function streamBlocks(transport, request, options) {
  const client = (0, _connect.createPromiseClient)(_proto.Stream, transport);
  return client.blocks(request, options);
}
//# sourceMappingURL=stream-blocks.js.map