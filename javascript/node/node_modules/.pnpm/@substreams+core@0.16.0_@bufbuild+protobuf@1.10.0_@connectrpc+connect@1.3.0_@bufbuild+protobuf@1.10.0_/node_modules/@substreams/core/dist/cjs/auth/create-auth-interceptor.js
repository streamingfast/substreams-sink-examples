"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAuthInterceptor = createAuthInterceptor;
function createAuthInterceptor(token) {
  return next => async req => {
    if (!req.header.has("Authorization")) {
      req.header.set("Authorization", `Bearer ${token}`);
    }
    return next(req);
  };
}
//# sourceMappingURL=create-auth-interceptor.js.map