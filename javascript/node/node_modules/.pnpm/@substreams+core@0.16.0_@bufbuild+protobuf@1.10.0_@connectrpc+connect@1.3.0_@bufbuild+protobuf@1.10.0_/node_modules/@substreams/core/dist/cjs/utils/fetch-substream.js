"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchSubstream = fetchSubstream;
var _createSubstream = /*#__PURE__*/require("./create-substream.js");
async function fetchSubstream(...args) {
  const response = await fetch(...args);
  if (!response.ok) {
    throw new Error(`Failed to fetch substream (code ${response.status}): ${response.statusText}`);
  }
  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  return (0, _createSubstream.createSubstream)(buffer);
}
//# sourceMappingURL=fetch-substream.js.map