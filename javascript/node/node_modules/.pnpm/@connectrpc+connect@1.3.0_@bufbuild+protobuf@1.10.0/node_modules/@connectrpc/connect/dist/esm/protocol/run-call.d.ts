import type { AnyMessage, Message, PartialMessage } from "@bufbuild/protobuf";
import type { Interceptor, StreamRequest, StreamResponse, UnaryRequest, UnaryResponse } from "../interceptor.js";
/**
 * UnaryFn represents the client-side invocation of a unary RPC - a method
 * that takes a single input message, and responds with a single output
 * message.
 * A Transport implements such a function, and makes it available to
 * interceptors.
 */
type UnaryFn<I extends Message<I> = AnyMessage, O extends Message<O> = AnyMessage> = (req: UnaryRequest<I, O>) => Promise<UnaryResponse<I, O>>;
/**
 * Runs a unary method with the given interceptors. Note that this function
 * is only used when implementing a Transport.
 */
export declare function runUnaryCall<I extends Message<I>, O extends Message<O>>(opt: {
    req: Omit<UnaryRequest<I, O>, "signal" | "message"> & {
        message: PartialMessage<I>;
    };
    next: UnaryFn<I, O>;
    timeoutMs?: number;
    signal?: AbortSignal;
    interceptors?: Interceptor[];
}): Promise<UnaryResponse<I, O>>;
/**
 * StreamingFn represents the client-side invocation of a streaming RPC - a
 * method that takes zero or more input messages, and responds with zero or
 * more output messages.
 * A Transport implements such a function, and makes it available to
 * interceptors.
 */
type StreamingFn<I extends Message<I> = AnyMessage, O extends Message<O> = AnyMessage> = (req: StreamRequest<I, O>) => Promise<StreamResponse<I, O>>;
/**
 * Runs a server-streaming method with the given interceptors. Note that this
 * function is only used when implementing a Transport.
 */
export declare function runStreamingCall<I extends Message<I>, O extends Message<O>>(opt: {
    req: Omit<StreamRequest<I, O>, "signal" | "message"> & {
        message: AsyncIterable<PartialMessage<I>>;
    };
    next: StreamingFn<I, O>;
    timeoutMs?: number;
    signal?: AbortSignal;
    interceptors?: Interceptor[];
}): Promise<StreamResponse<I, O>>;
export {};
