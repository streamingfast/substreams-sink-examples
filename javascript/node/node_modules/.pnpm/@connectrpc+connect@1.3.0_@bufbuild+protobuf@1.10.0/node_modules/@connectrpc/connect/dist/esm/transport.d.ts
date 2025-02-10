import type { AnyMessage, Message, MethodInfo, PartialMessage, ServiceType } from "@bufbuild/protobuf";
import type { StreamResponse, UnaryResponse } from "./interceptor.js";
import type { ContextValues } from "./context-values.js";
/**
 * Transport represents the underlying transport for a client.
 * A transport implements a protocol, such as Connect or gRPC-web, and allows
 * for the concrete clients to be independent of the protocol.
 */
export interface Transport {
    /**
     * Call a unary RPC - a method that takes a single input message, and
     * responds with a single output message.
     */
    unary<I extends Message<I> = AnyMessage, O extends Message<O> = AnyMessage>(service: ServiceType, method: MethodInfo<I, O>, signal: AbortSignal | undefined, timeoutMs: number | undefined, header: HeadersInit | undefined, input: PartialMessage<I>, contextValues?: ContextValues): Promise<UnaryResponse<I, O>>;
    /**
     * Call a streaming RPC - a method that takes zero or more input messages,
     * and responds with zero or more output messages.
     */
    stream<I extends Message<I> = AnyMessage, O extends Message<O> = AnyMessage>(service: ServiceType, method: MethodInfo<I, O>, signal: AbortSignal | undefined, timeoutMs: number | undefined, header: HeadersInit | undefined, input: AsyncIterable<PartialMessage<I>>, contextValues?: ContextValues): Promise<StreamResponse<I, O>>;
}
