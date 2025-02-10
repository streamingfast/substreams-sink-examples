"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invariant = invariant;
function invariant(condition, description = "Invariant") {
  if (!condition) {
    throw new Error(description);
  }
}
//# sourceMappingURL=invariant.js.map