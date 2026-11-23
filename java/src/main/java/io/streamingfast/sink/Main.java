package io.streamingfast.sink;

import java.nio.file.Path;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.ConsoleHandler;
import java.util.logging.Level;
import java.util.logging.Logger;
import sf.substreams.v1.PackageOuterClass.Package;

public final class Main {

    static final String DEFAULT_SPKG = "ethereum_common@v0.4.0";
    static final String DEFAULT_MODULE = "filtered_events";

    private Main() {}

    public static void main(String[] args) throws Exception {
        Config config;
        try {
            config = parseArgs(args);
        } catch (IllegalArgumentException e) {
            if (e.getMessage() != null && !e.getMessage().isEmpty()) {
                System.err.println("error: " + e.getMessage());
                System.err.println();
            }
            printUsage();
            System.exit(1);
            return;
        }

        if (config.http2FrameLog()) {
            enableHttp2FrameLog();
        }

        Package pkg = SpkgLoader.load(config.spkg(), config.params());
        var module = SpkgLoader.findModule(pkg, config.module());
        BlockRange range = BlockRange.parse(config.blockRange(), module.getInitialBlock());

        CursorStore cursorStore = new CursorStore(config.cursorFile());
        var saved = cursorStore.load();
        saved.ifPresent(s -> Log.info("Resuming from persisted cursor (block #%d) in %s", s.blockNum(), config.cursorFile()));

        var stream = new SubstreamsStream(
                config, new SubstreamsEndpoint(config), pkg, range, new SinkHandler(), cursorStore, saved);

        try {
            stream.run();
        } catch (Exception e) {
            Log.info("Stream terminated with error: %s", e);
            e.printStackTrace(System.out);
            System.exit(1);
        }
    }

    static Config parseArgs(String[] args) {
        List<String> positional = new ArrayList<>();
        List<Config.Param> params = new ArrayList<>();
        boolean finalBlocksOnly = false;
        boolean http2FrameLog = false;
        String authority = null;
        Path cursorFile = Path.of("data", "cursor.txt");
        Optional<Duration> keepAliveTime = Optional.empty();
        Optional<Duration> keepAliveTimeout = Optional.empty();
        Optional<Boolean> keepAliveWithoutCalls = Optional.empty();
        Optional<Duration> inactivityTimeout = Optional.empty();

        for (int i = 0; i < args.length; i++) {
            String arg = args[i];
            if (!arg.startsWith("--")) {
                positional.add(arg);
                continue;
            }

            String name = arg;
            String value = null;
            int eq = arg.indexOf('=');
            if (eq >= 0) {
                name = arg.substring(0, eq);
                value = arg.substring(eq + 1);
            }

            switch (name) {
                case "--help" -> throw new IllegalArgumentException("");
                case "--final-blocks-only" -> finalBlocksOnly = true;
                case "--http2-frame-log" -> http2FrameLog = true;
                default -> {
                    if (value == null) {
                        if (i + 1 >= args.length) {
                            throw new IllegalArgumentException("flag " + name + " requires a value");
                        }
                        value = args[++i];
                    }

                    switch (name) {
                        case "--params" -> params.addAll(parseParams(value));
                        case "--authority" -> authority = value;
                        case "--cursor-file" -> cursorFile = Path.of(value);
                        case "--keepalive-time" -> keepAliveTime = Optional.of(seconds(name, value));
                        case "--keepalive-timeout" -> keepAliveTimeout = Optional.of(seconds(name, value));
                        case "--keepalive-without-calls" -> keepAliveWithoutCalls = Optional.of(Boolean.parseBoolean(value));
                        case "--inactivity-timeout" -> inactivityTimeout = Optional.of(seconds(name, value));
                        default -> throw new IllegalArgumentException("unknown flag " + name);
                    }
                }
            }
        }

        // 0 means "disabled", same as not passing the flag at all
        keepAliveTime = keepAliveTime.filter(d -> !d.isZero());
        inactivityTimeout = inactivityTimeout.filter(d -> !d.isZero());

        if (positional.size() > 4) {
            throw new IllegalArgumentException("too many positional arguments");
        }

        String endpoint = positional.size() > 0 ? positional.get(0) : env("SUBSTREAMS_ENDPOINT");
        if (endpoint == null) {
            throw new IllegalArgumentException("missing <endpoint> (or SUBSTREAMS_ENDPOINT environment variable)");
        }

        return new Config(
                endpoint,
                positional.size() > 1 ? positional.get(1) : DEFAULT_SPKG,
                positional.size() > 2 ? positional.get(2) : DEFAULT_MODULE,
                positional.size() > 3 ? positional.get(3) : "",
                params,
                finalBlocksOnly,
                cursorFile,
                env("SUBSTREAMS_API_KEY"),
                keepAliveTime,
                keepAliveTimeout,
                keepAliveWithoutCalls,
                inactivityTimeout,
                http2FrameLog,
                authority);
    }

    /** Parses {@code module_one:(expr),module_two:(expr)}. */
    static List<Config.Param> parseParams(String input) {
        String value = input.trim();
        if (value.isEmpty()) {
            throw new IllegalArgumentException("wrong --params input value '" + value + "': empty string");
        }

        List<Config.Param> params = new ArrayList<>();
        for (String param : value.split(",")) {
            int idx = param.indexOf(':');
            if (idx < 0) {
                throw new IllegalArgumentException("wrong --params value for '" + param + "': missing ':' delimiter");
            }

            params.add(new Config.Param(param.substring(0, idx).trim(), param.substring(idx + 1).trim()));
        }

        return params;
    }

    private static Duration seconds(String flag, String value) {
        try {
            return Duration.ofSeconds(Long.parseLong(value));
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("flag " + flag + " expects an integer number of seconds, got '" + value + "'");
        }
    }

    private static String env(String name) {
        String value = System.getenv(name);
        return value == null || value.isEmpty() ? null : value;
    }

    // JUL only keeps weak references to loggers: hold it or the level/handler configuration can be garbage collected.
    private static Logger grpcNettyLogger;

    /**
     * grpc-netty logs every HTTP/2 frame (including GOAWAY, PING, RST_STREAM, in both directions) through loggers
     * under {@code io.grpc.netty} at FINE (Netty routes its DEBUG to JUL when no other logging framework is present).
     */
    private static void enableHttp2FrameLog() {
        System.setProperty("java.util.logging.SimpleFormatter.format", "%1$tFT%1$tT.%1$tL%1$tz %4$s [%3$s] %5$s%n");

        ConsoleHandler handler = new ConsoleHandler();
        handler.setLevel(Level.FINE);

        grpcNettyLogger = Logger.getLogger("io.grpc.netty");
        grpcNettyLogger.setLevel(Level.FINE);
        grpcNettyLogger.addHandler(handler);
    }

    private static void printUsage() {
        System.out.println(
                """
                usage: <endpoint> [<spkg> [<module> [<start>:<stop>]]] [flags]

                <endpoint> is `host:port` or `http(s)://host:port`, also read from SUBSTREAMS_ENDPOINT if omitted
                <spkg> can be a local file, a full URL or `spkg_package@version` (default: %s)
                <module> is the output module (default: %s)
                <start>:<stop> is the block range, `-1:` is current head and onwards forever (default: module's initial block)

                Flags:
                  --params=<params>               Comma separated <module_name>:<filter_expr> list passed to modules
                  --final-blocks-only             Only receive irreversible blocks (no undo signal ever sent)
                  --cursor-file=<path>            Where the cursor is persisted (default: data/cursor.txt)

                  --keepalive-time=<seconds>      gRPC keepalive PING interval, 0/unset = off (grpc-java default)
                  --keepalive-timeout=<seconds>   gRPC keepalive PING ack timeout, unset = grpc-java default (20s)
                  --keepalive-without-calls=<b>   Send keepalive PING even without active call, unset = grpc-java default (false)
                  --inactivity-timeout=<seconds>  Cancel and reconnect if no message in N seconds, 0/unset = off

                  --authority=<host>              Override TLS/:authority host name, useful when going through a local proxy
                  --http2-frame-log               Log every HTTP/2 frame (GOAWAY, PING, ...) sent and received

                Examples
                 # From head and onwards forever, irreversible blocks only
                 ./gradlew run --args="mainnet.eth.streamingfast.io:443 ethereum_common@v0.4.0 filtered_events -1: --final-blocks-only"

                 # With module parameters for filtering and a bounded range
                 ./gradlew run --args="mainnet.eth.streamingfast.io:443 ethereum_common@v0.4.0 filtered_events --params=filtered_events:<filter_expr> 21000000:+1"

                The environment variable SUBSTREAMS_API_KEY must be set
                and should contain a valid Substreams API key.
                """
                        .formatted(DEFAULT_SPKG, DEFAULT_MODULE));
    }
}
