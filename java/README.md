# Substreams Sink Java

This repository show cases a functional base Java project that consumes a Substreams `.spkg` (local or remote file) using [grpc-java](https://github.com/grpc/grpc-java) with the Netty transport (`io.grpc:grpc-netty`), pinned to **1.68.1**.

To run (requires a JDK 21+, Gradle is provided through the wrapper):

```bash
SUBSTREAMS_API_KEY="<StreamingFast API Key>" ./gradlew run --args="mainnet.eth.streamingfast.io:443"
```

Without further arguments it streams the `filtered_events` module of the `ethereum_common@v0.4.0` package from [spkg.io](https://spkg.io). The full usage is available with `./gradlew run --args="--help"`:

```
usage: <endpoint> [<spkg> [<module> [<start>:<stop>]]] [flags]
```

- `<endpoint>`: `host:port` or `http(s)://host:port` (defaults to TLS), also read from `SUBSTREAMS_ENDPOINT` when omitted.
- `<spkg>`: a local file, a full URL or `spkg_package@version` (default `ethereum_common@v0.4.0`).
- `<module>`: the output module (default `filtered_events`).
- `<start>:<stop>`: block range, `-1:` means from current head and onwards forever (default is the module's initial block).

| Flag                                | Description                                                                                                    |
|-------------------------------------|----------------------------------------------------------------------------------------------------------------|
| `--params=<module>:<expr>[,...]`    | Module parameters, same format as the Rust example.                                                            |
| `--final-blocks-only`               | Only receive irreversible blocks, no `BlockUndoSignal` is ever sent.                                           |
| `--cursor-file=<path>`              | Where the cursor is persisted (default `data/cursor.txt`).                                                     |
| `--keepalive-time=<seconds>`        | gRPC keepalive PING interval. Unset/`0` = off (grpc-java default).                                             |
| `--keepalive-timeout=<seconds>`     | gRPC keepalive PING ack timeout. Unset = grpc-java default (20s).                                              |
| `--keepalive-without-calls=<bool>`  | Send keepalive PINGs even with no active call. Unset = grpc-java default (`false`).                            |
| `--inactivity-timeout=<seconds>`    | Stream watchdog: if no message at all (including progress) in N seconds, cancel and reconnect. Unset/`0` = off. |
| `--authority=<host>`                | Override the TLS/`:authority` host name, needed when going through a local proxy using TLS.                    |
| `--http2-frame-log`                 | Log every HTTP/2 frame (GOAWAY, PING, RST_STREAM, ...) sent and received by Netty.                             |

Authentication is done with an API key read from the `SUBSTREAMS_API_KEY` environment variable (sent as the `x-api-key` header).

All keepalive flags are left untouched on the `NettyChannelBuilder` unless specified, so **out of the box the client behaves exactly like an unconfigured grpc-java client (keepalive off)**. Same for the watchdog, it is off by default.

> **Note** Gradle was picked over Maven because the [protobuf Gradle plugin](https://github.com/google/protobuf-gradle-plugin) generates both the messages and the gRPC stubs at build time from the `.proto` files in `src/main/proto` with a single plugin and no separate tool to install, and `./gradlew` needs nothing but a JDK.

## Details

`SubstreamsStream` ([SubstreamsStream.java](./src/main/java/io/streamingfast/sink/SubstreamsStream.java)) wraps the gRPC call and handles automatic reconnection, `SubstreamsStream.run()` only returns when the stop block is reached or throws on a fatal error (`UNAUTHENTICATED`, handler failure, cursor persistence failure). The block logic is plugged through the `BlockHandler` interface ([SinkHandler.java](./src/main/java/io/streamingfast/sink/SinkHandler.java) is the demo implementation).

### Reconnect & Cursor

1. On startup, the cursor is loaded from the cursor file (if any). Without a cursor, the stream starts at the requested start block.
2. Each block (or undo signal) is handed to the `BlockHandler`. Only **once the handler returned without error** is the cursor persisted (atomically replacing the file) and kept in memory.
3. Any failure of the stream (non-`UNAUTHENTICATED` gRPC status, connection closed, GOAWAY, watchdog cancellation, ...) triggers a reconnect that always sends the last persisted cursor as `start_cursor` (it takes precedence over the start block). A block is thus never skipped (cursor only advances after handling) nor applied twice (resume is done *after* the cursor's block). If the process dies in the middle of a `BlockScopedDatas` batch, the not yet handled items are re-delivered.
4. Reconnect uses exponential backoff, starting at 500ms, doubling up to a cap of 45s with ±20% jitter. The backoff is reset as soon as a block/undo signal was handled, i.e. after healthy progress.
5. A **new `ManagedChannel` is built for each attempt** (and the previous one shut down). After a silent connection death the old HTTP/2 transport could still look alive to grpc-java, reusing it would just hang again.

### Logging

Everything is logged to standard out with an ISO-8601 UTC timestamp, so lines can be correlated with server and load balancer logs:

```
2026-01-01T10:00:00.000000Z CONNECT attempt=1 endpoint=https://... start_block=-1 stop_block=0 final_blocks_only=true cursor_block=none(start_block=-1)
2026-01-01T10:00:00.100000Z CHANNEL state IDLE -> CONNECTING
2026-01-01T10:00:00.300000Z CHANNEL state CONNECTING -> READY
2026-01-01T10:00:00.500000Z CONNECTED session workers=... trace_id=...
2026-01-01T10:06:24.000000Z BLOCK #123 final=true
2026-01-01T10:12:48.000000Z GRPC_STATUS code=UNAVAILABLE description="Connection closed after GOAWAY. ..." cause=null
2026-01-01T10:12:48.000000Z RECONNECT reason="grpc status UNAVAILABLE" cursor_block=#123 backoff=480ms
```

- `BLOCK #<n> final=<bool>` for each block received (before it is handled).
- `RECONNECT reason=... cursor_block=...` for each reconnection (`cursor_block` is the block of the cursor the next connection resumes from).
- `GRPC_STATUS ...` for each gRPC status terminating a stream and a dedicated `GOAWAY` line when the status mentions it.
- `WATCHDOG ...` when the inactivity watchdog fires.
- `CHANNEL state A -> B` for every connectivity transition of the channel.
- `--http2-frame-log` additionally dumps raw HTTP/2 frames (`INBOUND GO_AWAY`, `OUTBOUND PING`, ...) which is the only place to see PINGs and GOAWAY details exactly as received.

### Incomplete Implementation

#### Cursor Persistence

The cursor is saved in a local file, which is only suitable for demo purposes. In production, save it in your database, **in the same transaction as the data it corresponds to**, in `CursorStore`.

#### Block Undo Signal

`BlockUndoSignal` must be treated as "delete every data that has been recorded after block height specified by the last valid block". If for example all your added record contain a block number, a simple way is to do `delete all records where block_num > last_valid_block.number` (this is true for append only records, so when only `INSERT` are allowed).

This is left to be implemented by you in `SinkHandler.onUndo`.

> **Warning** It throws `UnsupportedOperationException` (fatal, the process exits) if an undo signal is received, same as the Rust example, so be warned for a production system. Use `--final-blocks-only` to never receive any. Undo signals on Ethereum Mainnet happen around 5-10 times a day, even less so you might miss the fact that they exist when testing.

## Protobuf Generation

Generation happens automatically during `./gradlew build` using the Protobuf Gradle plugin (`protoc` and `protoc-gen-grpc-java` are downloaded as Maven artifacts, nothing to install). The inputs are the Substreams system Protobuf definitions found in `src/main/proto`, which were exported with [buf](https://buf.build/):

```bash
rm -rf src/main/proto && buf export buf.build/streamingfast/substreams:v1.18.2 -o src/main/proto
```

> **Note** Only `sf/firehose`, `sf/substreams/options.proto`, `sf/substreams/rpc` and `sf/substreams/v1` are required, remove the rest after exporting.

To decode your module's output, add your own `.proto` files (or the ones extracted from your `.spkg`) to `src/main/proto` and unpack the `Any` with the generated class, see `SinkHandler`.

## Tests

```bash
./gradlew test
```

The tests include a fake in-process Substreams server (Netty, plaintext) to verify reconnection, cursor resume and the watchdog.
