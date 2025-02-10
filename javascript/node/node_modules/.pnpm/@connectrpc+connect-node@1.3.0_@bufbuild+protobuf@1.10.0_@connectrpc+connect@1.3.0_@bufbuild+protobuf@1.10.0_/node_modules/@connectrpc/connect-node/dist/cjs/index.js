"use strict";
// Copyright 2021-2024 The Connect Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Http2SessionManager = exports.createNodeHttpClient = exports.universalResponseToNodeResponse = exports.universalRequestFromNodeRequest = exports.connectNodeAdapter = exports.compressionGzip = exports.compressionBrotli = exports.createConnectTransport = exports.createGrpcTransport = exports.createGrpcWebTransport = void 0;
// Polyfill the Headers API for Node versions < 18
require("./node-headers-polyfill.js");
var grpc_web_transport_js_1 = require("./grpc-web-transport.js");
Object.defineProperty(exports, "createGrpcWebTransport", { enumerable: true, get: function () { return grpc_web_transport_js_1.createGrpcWebTransport; } });
var grpc_transport_js_1 = require("./grpc-transport.js");
Object.defineProperty(exports, "createGrpcTransport", { enumerable: true, get: function () { return grpc_transport_js_1.createGrpcTransport; } });
var connect_transport_js_1 = require("./connect-transport.js");
Object.defineProperty(exports, "createConnectTransport", { enumerable: true, get: function () { return connect_transport_js_1.createConnectTransport; } });
var compression_js_1 = require("./compression.js");
Object.defineProperty(exports, "compressionBrotli", { enumerable: true, get: function () { return compression_js_1.compressionBrotli; } });
Object.defineProperty(exports, "compressionGzip", { enumerable: true, get: function () { return compression_js_1.compressionGzip; } });
var connect_node_adapter_js_1 = require("./connect-node-adapter.js");
Object.defineProperty(exports, "connectNodeAdapter", { enumerable: true, get: function () { return connect_node_adapter_js_1.connectNodeAdapter; } });
var node_universal_handler_js_1 = require("./node-universal-handler.js");
Object.defineProperty(exports, "universalRequestFromNodeRequest", { enumerable: true, get: function () { return node_universal_handler_js_1.universalRequestFromNodeRequest; } });
Object.defineProperty(exports, "universalResponseToNodeResponse", { enumerable: true, get: function () { return node_universal_handler_js_1.universalResponseToNodeResponse; } });
var node_universal_client_js_1 = require("./node-universal-client.js");
Object.defineProperty(exports, "createNodeHttpClient", { enumerable: true, get: function () { return node_universal_client_js_1.createNodeHttpClient; } });
var http2_session_manager_js_1 = require("./http2-session-manager.js");
Object.defineProperty(exports, "Http2SessionManager", { enumerable: true, get: function () { return http2_session_manager_js_1.Http2SessionManager; } });
