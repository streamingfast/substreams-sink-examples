package io.streamingfast.sink;

import java.nio.file.Path;
import java.time.Duration;
import java.util.List;
import java.util.Optional;

/**
 * Everything the sink needs, resolved from command line flags and environment variables.
 *
 * <p>gRPC keepalive values are {@link Optional}: when empty, the corresponding {@code NettyChannelBuilder}
 * method is never called so the client behaves exactly like an unconfigured grpc-java client (keepalive off).
 */
record Config(
        String endpoint,
        String spkg,
        String module,
        String blockRange,
        List<Param> params,
        boolean finalBlocksOnly,
        Path cursorFile,
        String apiKey,
        Optional<Duration> keepAliveTime,
        Optional<Duration> keepAliveTimeout,
        Optional<Boolean> keepAliveWithoutCalls,
        Optional<Duration> inactivityTimeout,
        boolean http2FrameLog,
        String authority) {

    /** Module parameter, in the form {@code <module_name>:<expression>}. */
    record Param(String moduleName, String expression) {}
}
