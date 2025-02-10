import { ConnectError } from "@connectrpc/connect";
/**
 * Similar to ConnectError.from(), this function turns any value into
 * a ConnectError, but special cases some Node.js specific error codes and
 * sets an appropriate Connect error code.
 */
export declare function connectErrorFromNodeReason(reason: unknown): ConnectError;
/**
 * Unwraps a chain of errors, by walking through all "cause" properties
 * recursively.
 * This function is useful to find the root cause of an error.
 */
export declare function unwrapNodeErrorChain(reason: unknown): Error[];
/**
 * Returns standard Node.js error properties from the given reason, if present.
 *
 * For context: Every error raised by Node.js APIs should expose a `code`
 * property - a string that permanently identifies the error. Some errors may
 * have an additional `syscall` property - a string that identifies native
 * components, for example "getaddrinfo" of libuv.
 * For more information, see https://github.com/nodejs/node/blob/f6052c68c1f9a4400a723e9c0b79da14197ab754/lib/internal/errors.js
 */
export declare function getNodeErrorProps(reason: unknown): {
    code?: string;
    syscall?: string;
};
/**
 * Returns a ConnectError for an HTTP/2 error code.
 */
export declare function connectErrorFromH2ResetCode(rstCode: number): ConnectError | undefined;
export declare enum H2Code {
    PROTOCOL_ERROR = 1,
    INTERNAL_ERROR = 2,
    FLOW_CONTROL_ERROR = 3,
    SETTINGS_TIMEOUT = 4,
    STREAM_CLOSED = 5,
    FRAME_SIZE_ERROR = 6,
    REFUSED_STREAM = 7,
    CANCEL = 8,
    COMPRESSION_ERROR = 9,
    CONNECT_ERROR = 10,
    ENHANCE_YOUR_CALM = 11,
    INADEQUATE_SECURITY = 12,
    HTTP_1_1_REQUIRED = 13
}
