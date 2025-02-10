import type { ConnectRouter, ConnectRouterOptions, ContextValues } from "@connectrpc/connect";
import type { NodeHandlerFn, NodeServerRequest } from "./node-universal-handler.js";
export interface ConnectNodeAdapterOptions extends ConnectRouterOptions {
    /**
     * Route definitions. We recommend the following pattern:
     *
     * Create a file `connect.ts` with a default export such as this:
     *
     * ```ts
     * import {ConnectRouter} from "@connectrpc/connect";
     *
     * export default (router: ConnectRouter) => {
     *   router.service(ElizaService, {});
     * }
     * ```
     *
     * Then pass this function here.
     */
    routes: (router: ConnectRouter) => void;
    /**
     * If none of the handler request paths match, a 404 is served. This option
     * can provide a custom fallback for this case.
     */
    fallback?: NodeHandlerFn;
    /**
     * Serve all handlers under this prefix. For example, the prefix "/something"
     * will serve the RPC foo.FooService/Bar under "/something/foo.FooService/Bar".
     * Note that many gRPC client implementations do not allow for prefixes.
     */
    requestPathPrefix?: string;
    /**
     * Context values to extract from the request. These values are passed to
     * the handlers.
     */
    contextValues?: (req: NodeServerRequest) => ContextValues;
}
/**
 * Create a Node.js request handler from a ConnectRouter.
 *
 * The returned function is compatible with http.RequestListener and its equivalent for http2.
 */
export declare function connectNodeAdapter(options: ConnectNodeAdapterOptions): NodeHandlerFn;
