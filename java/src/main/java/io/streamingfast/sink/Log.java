package io.streamingfast.sink;

import java.time.Instant;
import java.time.format.DateTimeFormatter;

/** Minimal timestamped stdout logger so lines can be correlated with server and load balancer logs. */
final class Log {

    private Log() {}

    static void info(String format, Object... args) {
        System.out.println(DateTimeFormatter.ISO_INSTANT.format(Instant.now()) + " " + String.format(format, args));
    }
}
