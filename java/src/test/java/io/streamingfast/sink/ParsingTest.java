package io.streamingfast.sink;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.nio.file.Path;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

class ParsingTest {

    @Test
    void blockRange() {
        assertEquals(new BlockRange(10, 0), BlockRange.parse("", 10));
        assertEquals(new BlockRange(-1, 0), BlockRange.parse("-1:", 10));
        assertEquals(new BlockRange(100, 150), BlockRange.parse("100:150", 10));
        assertEquals(new BlockRange(100, 110), BlockRange.parse("100:+10", 10));
        assertEquals(new BlockRange(15, 0), BlockRange.parse("+5:", 10));
        assertEquals(new BlockRange(10, 20), BlockRange.parse("20", 10));
        assertThrows(IllegalArgumentException.class, () -> BlockRange.parse("abc:", 0));
    }

    @Test
    void params() {
        var params = Main.parseParams(" first:(type:transfer), second:(type:action)");
        assertEquals(2, params.size());
        assertEquals(new Config.Param("first", "(type:transfer)"), params.get(0));
        assertEquals(new Config.Param("second", "(type:action)"), params.get(1));

        assertThrows(IllegalArgumentException.class, () -> Main.parseParams("filtered_events"));
        assertThrows(IllegalArgumentException.class, () -> Main.parseParams(""));
    }

    @Test
    void registryReference() {
        assertEquals("ethereum_common/v0.4.0", SpkgLoader.registryReference("ethereum_common@v0.4.0"));
        assertEquals("ethereum-common/latest", SpkgLoader.registryReference("ethereum-common"));
        assertNull(SpkgLoader.registryReference("./local/file.spkg"));
        assertThrows(IllegalArgumentException.class, () -> SpkgLoader.registryReference("common@nope"));
    }

    @Test
    void keepAliveDefaultsToUnset() {
        Config config = Main.parseArgs(new String[] {"localhost:9000"});
        assertEquals(Optional.empty(), config.keepAliveTime());
        assertEquals(Optional.empty(), config.keepAliveTimeout());
        assertEquals(Optional.empty(), config.keepAliveWithoutCalls());
        assertEquals(Optional.empty(), config.inactivityTimeout());
        assertEquals(Main.DEFAULT_SPKG, config.spkg());
        assertEquals(Main.DEFAULT_MODULE, config.module());

        Config tuned = Main.parseArgs(new String[] {
            "localhost:9000", "--keepalive-time=30", "--keepalive-timeout", "10", "--keepalive-without-calls=true",
            "--inactivity-timeout=300"
        });
        assertEquals(30, tuned.keepAliveTime().orElseThrow().toSeconds());
        assertEquals(10, tuned.keepAliveTimeout().orElseThrow().toSeconds());
        assertEquals(Optional.of(true), tuned.keepAliveWithoutCalls());
        assertEquals(300, tuned.inactivityTimeout().orElseThrow().toSeconds());
    }

    @Test
    void cursorStoreRoundTrip(@TempDir Path dir) throws Exception {
        CursorStore store = new CursorStore(dir.resolve("sub/cursor.txt"));
        assertEquals(Optional.empty(), store.load());

        store.save("abc", 42);
        assertEquals(new CursorStore.Saved("abc", 42), store.load().orElseThrow());

        store.save("def", 43);
        assertEquals(new CursorStore.Saved("def", 43), store.load().orElseThrow());
    }
}
