"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toHex = toHex;
function toHex(array) {
  return Array.from(array, value => value.toString(16).padStart(2, "0")).join("");
}
//# sourceMappingURL=to-hex.js.map