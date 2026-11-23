package io.streamingfast.sink;

/** Start/stop block resolved from the {@code [<start>:<stop>]} argument. A stop of 0 means "forever". */
record BlockRange(long start, long stop) {

    /**
     * Accepts {@code <start>:<stop>}, {@code <start>:}, {@code :<stop>} or {@code <stop>} where either side can be
     * relative ({@code +N}); a negative start is relative to chain head, an empty start is the module's initial block.
     */
    static BlockRange parse(String input, long moduleInitialBlock) {
        String value = input == null ? "" : input;
        String prefix = "";
        String suffix = value;
        int idx = value.indexOf(':');
        if (idx >= 0) {
            prefix = value.substring(0, idx);
            suffix = value.substring(idx + 1);
        }

        long start;
        if (prefix.isEmpty()) {
            start = moduleInitialBlock;
        } else if (prefix.startsWith("+")) {
            start = moduleInitialBlock + parseLong(prefix.substring(1), "<start>");
        } else {
            start = parseLong(prefix, "<start>");
        }

        long stop;
        if (suffix.isEmpty() || suffix.equals("-")) {
            stop = 0;
        } else if (suffix.startsWith("+")) {
            stop = start + parseLong(suffix.substring(1), "<stop>");
        } else {
            stop = parseLong(suffix, "<stop>");
        }

        return new BlockRange(start, stop);
    }

    private static long parseLong(String value, String name) {
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("argument " + name + " is not a valid integer: '" + value + "'");
        }
    }
}
