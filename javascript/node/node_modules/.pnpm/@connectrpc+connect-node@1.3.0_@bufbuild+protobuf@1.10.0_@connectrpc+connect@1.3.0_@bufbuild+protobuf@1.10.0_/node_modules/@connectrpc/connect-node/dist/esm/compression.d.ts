import type { Compression } from "@connectrpc/connect/protocol";
/**
 * The gzip compression algorithm, implemented with the Node.js built-in module
 * zlib. This value can be used for the `sendCompression` and `acceptCompression`
 * option of client transports, or for the `acceptCompression` option of server
 * plugins like `fastifyConnectPlugin` from @connectrpc/connect-fastify.
 */
export declare const compressionGzip: Compression;
/**
 * The brotli compression algorithm, implemented with the Node.js built-in module
 * zlib. This value can be used for the `sendCompression` and `acceptCompression`
 * option of client transports, or for the `acceptCompression` option of server
 * plugins like `fastifyConnectPlugin` from @connectrpc/connect-fastify.
 */
export declare const compressionBrotli: Compression;
