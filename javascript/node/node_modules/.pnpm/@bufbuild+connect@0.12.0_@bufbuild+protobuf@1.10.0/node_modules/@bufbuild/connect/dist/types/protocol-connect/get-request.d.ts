import { Message } from "@bufbuild/protobuf";
import type { AnyMessage } from "@bufbuild/protobuf";
import type { UnaryRequest } from "../interceptor.js";
/**
 * @private Internal code, does not follow semantic versioning.
 */
export declare function transformConnectPostToGetRequest<I extends Message<I> = AnyMessage, O extends Message<O> = AnyMessage>(request: UnaryRequest<I, O>, message: Uint8Array, useBase64: boolean): UnaryRequest<I, O>;
