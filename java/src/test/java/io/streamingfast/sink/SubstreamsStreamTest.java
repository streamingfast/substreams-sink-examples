package io.streamingfast.sink;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.google.protobuf.Timestamp;
import io.grpc.Server;
import io.grpc.Status;
import io.grpc.netty.NettyServerBuilder;
import io.grpc.stub.StreamObserver;
import java.net.InetSocketAddress;
import java.nio.file.Path;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.function.BiConsumer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import sf.substreams.rpc.v2.Service.BlockScopedData;
import sf.substreams.rpc.v3.Service.Request;
import sf.substreams.rpc.v4.Service.BlockScopedDatas;
import sf.substreams.rpc.v4.Service.Response;
import sf.substreams.rpc.v4.StreamGrpc;
import sf.substreams.v1.ClockOuterClass.Clock;
import sf.substreams.v1.PackageOuterClass.Package;

/** Exercises reconnect + cursor behavior against an in-test fake Substreams server (plaintext, Netty). */
class SubstreamsStreamTest {

    private Server server;
    private final List<String> startCursors = new CopyOnWriteArrayList<>();

    @AfterEach
    void stop() {
        if (server != null) {
            server.shutdownNow();
        }
    }

    private Config startServer(Path dir, BiConsumer<Integer, StreamObserver<Response>> script, Optional<Duration> watchdog)
            throws Exception {
        var counter = new java.util.concurrent.atomic.AtomicInteger();
        server = NettyServerBuilder.forAddress(new InetSocketAddress("localhost", 0))
                .addService(new StreamGrpc.StreamImplBase() {
                    @Override
                    public void blocks(Request request, StreamObserver<Response> observer) {
                        startCursors.add(request.getStartCursor());
                        script.accept(counter.incrementAndGet(), observer);
                    }
                })
                .build()
                .start();

        return new Config(
                "http://localhost:" + server.getPort(), "unused", "m", "", List.of(), true, dir.resolve("cursor.txt"),
                null, Optional.empty(), Optional.empty(), Optional.empty(), watchdog, false, null);
    }

    private static Response block(long number) {
        BlockScopedData data = BlockScopedData.newBuilder()
                .setCursor("cursor-" + number)
                .setFinalBlockHeight(number)
                .setClock(Clock.newBuilder().setNumber(number).setTimestamp(Timestamp.getDefaultInstance()))
                .build();
        return Response.newBuilder()
                .setBlockScopedDatas(BlockScopedDatas.newBuilder().addItems(data))
                .build();
    }

    private static SubstreamsStream stream(Config config, List<Long> handled, Path dir) throws Exception {
        BlockHandler handler = new BlockHandler() {
            public void onBlock(BlockScopedData data) {
                handled.add(data.getClock().getNumber());
            }

            public void onUndo(sf.substreams.rpc.v2.Service.BlockUndoSignal signal) {
                throw new UnsupportedOperationException();
            }
        };
        CursorStore store = new CursorStore(config.cursorFile());
        return new SubstreamsStream(
                config, new SubstreamsEndpoint(config), Package.getDefaultInstance(), new BlockRange(0, 0), handler,
                store, store.load());
    }

    @Test
    void reconnectsFromPersistedCursor(@TempDir Path dir) throws Exception {
        Config config = startServer(dir, (call, out) -> {
            if (call == 1) {
                out.onNext(block(1));
                out.onNext(block(2));
                out.onError(Status.UNAVAILABLE.withDescription("Connection closed after GOAWAY").asException());
            } else {
                out.onNext(block(3));
                out.onCompleted();
            }
        }, Optional.empty());

        List<Long> handled = new ArrayList<>();
        stream(config, handled, dir).run();

        assertEquals(List.of(1L, 2L, 3L), handled);
        assertEquals(List.of("", "cursor-2"), startCursors);
        assertEquals("cursor-3", new CursorStore(config.cursorFile()).load().orElseThrow().cursor());
    }

    @Test
    void watchdogCancelsSilentStreamAndResumes(@TempDir Path dir) throws Exception {
        CountDownLatch hang = new CountDownLatch(1);
        Config config = startServer(dir, (call, out) -> {
            if (call == 1) {
                out.onNext(block(1));
                // Never send anything else: silent stream.
                try {
                    hang.await(30, TimeUnit.SECONDS);
                } catch (InterruptedException ignored) {
                }
            } else {
                out.onNext(block(2));
                out.onCompleted();
            }
        }, Optional.of(Duration.ofSeconds(2)));

        List<Long> handled = new ArrayList<>();
        try {
            stream(config, handled, dir).run();
        } finally {
            hang.countDown();
        }

        assertEquals(List.of(1L, 2L), handled);
        assertEquals(List.of("", "cursor-1"), startCursors);
    }

    @Test
    void handlerFailureIsFatalAndCursorNotAdvanced(@TempDir Path dir) throws Exception {
        Config config = startServer(dir, (call, out) -> {
            out.onNext(block(1));
            out.onCompleted();
        }, Optional.empty());

        CursorStore store = new CursorStore(config.cursorFile());
        BlockHandler failing = new BlockHandler() {
            public void onBlock(BlockScopedData data) {
                throw new IllegalStateException("boom");
            }

            public void onUndo(sf.substreams.rpc.v2.Service.BlockUndoSignal signal) {}
        };
        var stream = new SubstreamsStream(
                config, new SubstreamsEndpoint(config), Package.getDefaultInstance(), new BlockRange(0, 0), failing,
                store, Optional.empty());

        assertThrows(IllegalStateException.class, stream::run);
        assertEquals(Optional.empty(), store.load());
    }

    @Test
    void unauthenticatedIsFatal(@TempDir Path dir) throws Exception {
        Config config = startServer(dir, (call, out) -> out.onError(Status.UNAUTHENTICATED.asException()), Optional.empty());

        assertThrows(io.grpc.StatusRuntimeException.class, () -> stream(config, new ArrayList<>(), dir).run());
        assertEquals(1, startCursors.size());
    }
}
