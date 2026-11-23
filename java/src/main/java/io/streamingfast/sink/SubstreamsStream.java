package io.streamingfast.sink;

import io.grpc.Context;
import io.grpc.ManagedChannel;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import java.time.Duration;
import java.util.Iterator;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import sf.substreams.rpc.v2.Service.BlockScopedData;
import sf.substreams.rpc.v2.Service.BlockUndoSignal;
import sf.substreams.rpc.v2.Service.ModulesProgress;
import sf.substreams.rpc.v2.Service.SessionInit;
import sf.substreams.rpc.v3.Service.Request;
import sf.substreams.rpc.v4.Service.Response;
import sf.substreams.rpc.v4.StreamGrpc;
import sf.substreams.v1.PackageOuterClass.Package;

/**
 * Forever-connected Substreams stream: connects, hands each block to the {@link BlockHandler}, and transparently
 * reconnects on failure.
 *
 * <p>Cursor rules:
 *
 * <ul>
 *   <li>The cursor is persisted only after the handler fully handled the block (or undo signal).
 *   <li>Every (re)connection resumes from the last persisted cursor, never from the start block (unless no cursor was
 *       ever persisted), so a block is neither skipped nor applied twice.
 * </ul>
 */
final class SubstreamsStream {

    private static final Duration BACKOFF_INITIAL = Duration.ofMillis(500);
    private static final Duration BACKOFF_MAX = Duration.ofSeconds(45);
    private static final Duration PROGRESS_LOG_EVERY = Duration.ofSeconds(30);
    private static final int MAX_INBOUND_MESSAGE_SIZE = 10 * 1024 * 1024;

    private final Config config;
    private final SubstreamsEndpoint endpoint;
    private final Package pkg;
    private final BlockRange range;
    private final BlockHandler handler;
    private final CursorStore cursorStore;

    // volatile: read by the watchdog thread for logging
    private volatile String cursor;
    private volatile long cursorBlockNum;
    private Duration backoff = BACKOFF_INITIAL;
    private long lastProgressLogNanos = System.nanoTime() - PROGRESS_LOG_EVERY.toNanos();

    SubstreamsStream(
            Config config,
            SubstreamsEndpoint endpoint,
            Package pkg,
            BlockRange range,
            BlockHandler handler,
            CursorStore cursorStore,
            Optional<CursorStore.Saved> initialCursor) {
        this.config = config;
        this.endpoint = endpoint;
        this.pkg = pkg;
        this.range = range;
        this.handler = handler;
        this.cursorStore = cursorStore;
        this.cursor = initialCursor.map(CursorStore.Saved::cursor).orElse("");
        this.cursorBlockNum = initialCursor.map(CursorStore.Saved::blockNum).orElse(-1L);
    }

    /**
     * Blocks until the stream completes (stop block reached) and returns normally, or throws on a fatal error:
     * unauthenticated, handler failure or cursor persistence failure. Everything else is retried forever.
     */
    void run() throws Exception {
        ScheduledExecutorService watchdogExecutor = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "stream-watchdog");
            t.setDaemon(true);
            return t;
        });

        try {
            for (int attempt = 1; ; attempt++) {
                Log.info(
                        "CONNECT attempt=%d endpoint=%s start_block=%d stop_block=%d final_blocks_only=%s cursor_block=%s",
                        attempt, endpoint, range.start(), range.stop(), config.finalBlocksOnly(), cursorBlockLabel());

                String reason = connectAndConsume(watchdogExecutor);
                if (reason == null) {
                    Log.info("STREAM completed, reached stop block");
                    return;
                }

                Duration sleep = nextBackoff();
                Log.info(
                        "RECONNECT reason=\"%s\" cursor_block=%s backoff=%dms",
                        reason, cursorBlockLabel(), sleep.toMillis());
                Thread.sleep(sleep);
            }
        } finally {
            watchdogExecutor.shutdownNow();
        }
    }

    /** Returns null when the stream completed, or the reason to reconnect. Throws on fatal errors. */
    private String connectAndConsume(ScheduledExecutorService watchdogExecutor) throws Exception {
        ManagedChannel channel = endpoint.newChannel();
        Context.CancellableContext context = Context.current().withCancellation();
        Watchdog watchdog = new Watchdog(context);
        ScheduledFuture<?> watchdogTask = config.inactivityTimeout()
                .map(timeout -> watchdogExecutor.scheduleWithFixedDelay(
                        () -> watchdog.check(timeout), 1, 1, TimeUnit.SECONDS))
                .orElse(null);

        try {
            return context.call(() -> consume(channel, watchdog));
        } catch (StatusRuntimeException e) {
            return describeStatus(e, watchdog);
        } finally {
            if (watchdogTask != null) {
                watchdogTask.cancel(false);
            }
            context.cancel(null);
            channel.shutdownNow();
        }
    }

    private String consume(ManagedChannel channel, Watchdog watchdog) throws Exception {
        Request request = Request.newBuilder()
                .setStartBlockNum(range.start())
                .setStartCursor(cursor)
                .setStopBlockNum(range.stop())
                .setFinalBlocksOnly(config.finalBlocksOnly())
                .setProductionMode(true)
                .setOutputModule(config.module())
                .setPackage(pkg)
                .setProgressMessagesIntervalMs(30_000)
                .build();

        StreamGrpc.StreamBlockingStub stub = StreamGrpc.newBlockingStub(channel)
                .withCompression("gzip")
                .withMaxInboundMessageSize(MAX_INBOUND_MESSAGE_SIZE);

        Iterator<Response> responses = stub.blocks(request);
        while (responses.hasNext()) {
            Response response = responses.next();
            watchdog.touch();

            switch (response.getMessageCase()) {
                case SESSION -> {
                    SessionInit session = response.getSession();
                    Log.info(
                            "CONNECTED session workers=%d trace_id=%s",
                            session.getMaxParallelWorkers(), session.getTraceId());
                }
                case BLOCK_SCOPED_DATAS -> {
                    for (BlockScopedData data : response.getBlockScopedDatas().getItemsList()) {
                        handleBlock(data);
                    }
                }
                case BLOCK_UNDO_SIGNAL -> handleUndo(response.getBlockUndoSignal());
                case PROGRESS -> logProgress(response.getProgress());
                case FATAL_ERROR ->
                    Log.info("FATAL_ERROR message from server: %s", response.getFatalError().getReason());
                default -> {}
            }

            // Handling time must not count as stream inactivity
            watchdog.touch();
        }

        // The server closed the stream cleanly, which only happens once the stop block has been reached.
        return null;
    }

    private void handleBlock(BlockScopedData data) throws Exception {
        long number = data.getClock().getNumber();
        Log.info("BLOCK #%d final=%s", number, number <= data.getFinalBlockHeight());

        handler.onBlock(data);
        persist(data.getCursor(), number);
    }

    private void handleUndo(BlockUndoSignal signal) throws Exception {
        long lastValid = signal.getLastValidBlock().getNumber();
        Log.info("UNDO last_valid_block=#%d", lastValid);

        handler.onUndo(signal);
        persist(signal.getLastValidCursor(), lastValid);
    }

    /** Persists first, then advances the in-memory cursor: both always agree on "fully handled". */
    private void persist(String newCursor, long blockNum) throws Exception {
        cursorStore.save(newCursor, blockNum);
        cursor = newCursor;
        cursorBlockNum = blockNum;
        // Healthy progress, the next failure starts again from the shortest delay.
        backoff = BACKOFF_INITIAL;
    }

    private void logProgress(ModulesProgress progress) {
        long now = System.nanoTime();
        if (now - lastProgressLogNanos < PROGRESS_LOG_EVERY.toNanos()) {
            return;
        }

        lastProgressLogNanos = now;
        Log.info(
                "PROGRESS stages=%d running_jobs=%d",
                progress.getStagesCount(), progress.getRunningJobsCount());
    }

    private String describeStatus(StatusRuntimeException e, Watchdog watchdog) throws StatusRuntimeException {
        Status status = e.getStatus();
        Log.info(
                "GRPC_STATUS code=%s description=\"%s\" cause=%s",
                status.getCode(), status.getDescription(), status.getCause());

        // Netty surfaces a server GOAWAY through the description, e.g. "Connection closed after GOAWAY".
        if (String.valueOf(status.getDescription()).contains("GOAWAY")) {
            Log.info("GOAWAY received from server or intermediary: %s", status.getDescription());
        }

        if (status.getCode() == Status.Code.UNAUTHENTICATED) {
            throw e;
        }

        if (watchdog.fired()) {
            return "inactivity watchdog fired after no message for " + config.inactivityTimeout().orElseThrow().toSeconds() + "s";
        }

        return "grpc status " + status.getCode();
    }

    private Duration nextBackoff() {
        Duration current = backoff;
        backoff = backoff.multipliedBy(2).compareTo(BACKOFF_MAX) > 0 ? BACKOFF_MAX : backoff.multipliedBy(2);

        // +/- 20% jitter so many clients don't reconnect in lockstep
        double jitter = 0.8 + ThreadLocalRandom.current().nextDouble() * 0.4;
        return Duration.ofMillis((long) (current.toMillis() * jitter));
    }

    private String cursorBlockLabel() {
        if (cursor.isEmpty()) {
            return "none(start_block=" + range.start() + ")";
        }

        return cursorBlockNum >= 0 ? "#" + cursorBlockNum : "unknown";
    }

    /** Cancels the call when no message was received for the configured duration. */
    private final class Watchdog {
        private final Context.CancellableContext context;
        private volatile long lastMessageNanos = System.nanoTime();
        private final AtomicBoolean fired = new AtomicBoolean(false);

        Watchdog(Context.CancellableContext context) {
            this.context = context;
        }

        void touch() {
            lastMessageNanos = System.nanoTime();
        }

        boolean fired() {
            return fired.get();
        }

        void check(Duration timeout) {
            long idleNanos = System.nanoTime() - lastMessageNanos;
            if (idleNanos < timeout.toNanos() || fired.getAndSet(true)) {
                return;
            }

            Log.info(
                    "WATCHDOG no message for %ds (limit %ds), cancelling stream, last cursor_block=%s",
                    TimeUnit.NANOSECONDS.toSeconds(idleNanos), timeout.toSeconds(), cursorBlockLabel());
            context.cancel(new RuntimeException("inactivity watchdog"));
        }
    }
}
