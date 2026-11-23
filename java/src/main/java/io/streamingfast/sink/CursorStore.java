package io.streamingfast.sink;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

/**
 * Persists the cursor in a local file. This is the "database" of the example: swap it with your own storage, ideally
 * saving the cursor in the same transaction as the data it corresponds to.
 *
 * <p>File format: first line is the cursor, second line is the block number it was produced at (informational, only
 * used for logging).
 */
final class CursorStore {

    record Saved(String cursor, long blockNum) {}

    private final Path file;

    CursorStore(Path file) {
        this.file = file;
    }

    Optional<Saved> load() throws IOException {
        if (!Files.exists(file)) {
            return Optional.empty();
        }

        List<String> lines = Files.readAllLines(file, StandardCharsets.UTF_8);
        if (lines.isEmpty() || lines.get(0).isBlank()) {
            return Optional.empty();
        }

        long blockNum = lines.size() > 1 ? Long.parseLong(lines.get(1).trim()) : -1;
        return Optional.of(new Saved(lines.get(0).trim(), blockNum));
    }

    /** Atomically replaces the file so a crash mid-write never leaves a truncated cursor behind. */
    void save(String cursor, long blockNum) throws IOException {
        Path parent = file.toAbsolutePath().getParent();
        if (parent != null) {
            Files.createDirectories(parent);
        }

        Path tmp = file.resolveSibling(file.getFileName() + ".tmp");
        Files.writeString(tmp, cursor + "\n" + blockNum + "\n", StandardCharsets.UTF_8);
        try {
            Files.move(tmp, file, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);
        } catch (AtomicMoveNotSupportedException e) {
            Files.move(tmp, file, StandardCopyOption.REPLACE_EXISTING);
        }
    }
}
