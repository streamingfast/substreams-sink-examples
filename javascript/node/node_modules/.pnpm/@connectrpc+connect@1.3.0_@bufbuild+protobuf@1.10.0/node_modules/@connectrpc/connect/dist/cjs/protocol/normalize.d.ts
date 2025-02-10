import type { PartialMessage, MessageType } from "@bufbuild/protobuf";
import { Message } from "@bufbuild/protobuf";
/**
 *  Takes a partial protobuf messages of the
 *  specified message type as input, and returns full instances.
 */
export declare function normalize<T extends Message<T>>(type: MessageType<T>, message: T | PartialMessage<T>): T;
/**
 * Takes an AsyncIterable of partial protobuf messages of the
 * specified message type as input, and yields full instances.
 */
export declare function normalizeIterable<T extends Message<T>>(messageType: MessageType<T>, input: AsyncIterable<T | PartialMessage<T>>): AsyncIterable<T>;
