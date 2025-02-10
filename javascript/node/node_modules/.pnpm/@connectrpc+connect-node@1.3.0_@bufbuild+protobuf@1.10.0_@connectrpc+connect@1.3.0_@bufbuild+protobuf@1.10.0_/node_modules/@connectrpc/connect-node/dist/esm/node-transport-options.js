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
import { validateReadWriteMaxBytes } from "@connectrpc/connect/protocol";
import { compressionBrotli, compressionGzip } from "./compression.js";
import { createNodeHttpClient } from "./node-universal-client.js";
import { Http2SessionManager } from "./http2-session-manager.js";
import * as http2 from "http2";
import * as http from "http";
import * as https from "https";
/**
 * Asserts that the options are within sane limits, and returns default values
 * where no value is provided.
 *
 * @private Internal code, does not follow semantic versioning.
 */
export function validateNodeTransportOptions(options) {
    var _a, _b, _c, _d;
    let httpClient;
    if (options.httpVersion == "2") {
        let sessionManager;
        if (options.sessionManager) {
            sessionManager = options.sessionManager;
        }
        else {
            sessionManager = new Http2SessionManager(options.baseUrl, {
                pingIntervalMs: options.pingIntervalMs,
                pingIdleConnection: options.pingIdleConnection,
                pingTimeoutMs: options.pingTimeoutMs,
                idleConnectionTimeoutMs: options.idleConnectionTimeoutMs,
            }, options.nodeOptions);
        }
        httpClient = createNodeHttpClient({
            httpVersion: "2",
            sessionProvider: () => sessionManager,
        });
    }
    else {
        httpClient = createNodeHttpClient({
            httpVersion: "1.1",
            nodeOptions: options.nodeOptions,
        });
    }
    return Object.assign(Object.assign(Object.assign({}, options), { httpClient, useBinaryFormat: (_a = options.useBinaryFormat) !== null && _a !== void 0 ? _a : true, interceptors: (_b = options.interceptors) !== null && _b !== void 0 ? _b : [], sendCompression: (_c = options.sendCompression) !== null && _c !== void 0 ? _c : null, acceptCompression: (_d = options.acceptCompression) !== null && _d !== void 0 ? _d : [
            compressionGzip,
            compressionBrotli,
        ] }), validateReadWriteMaxBytes(options.readMaxBytes, options.writeMaxBytes, options.compressMinBytes));
}
