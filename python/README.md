# Substreams Sink Python

This repository show cases a functional base Python project that consumes a Substreams `.spkg` (local or remote file) using [grpcio](https://grpc.io/docs/languages/python/) and Protobuf/gRPC code generated with the [Buf remote plugins for Python](https://buf.build/protocolbuffers/python).

To run (requires [uv](https://docs.astral.sh/uv/getting-started/installation/), the generated Protobuf/gRPC code is already committed in `gen/`):

```bash
uv sync
SUBSTREAMS_API_KEY="<StreamingFast API Key>" uv run python main.py mainnet.eth.streamingfast.io:443
```

Without further arguments it streams the `filtered_events` module of the `ethereum_common@v0.4.0` package from [spkg.io](https://spkg.io). The full usage is available with `uv run python main.py --help`:

```
usage: main.py <endpoint> [<spkg> [<module> [<start>:<stop>]]] [flags]
```

- `<endpoint>`: `host:port` or `http(s)://host:port` (defaults to TLS), also read from `SUBSTREAMS_ENDPOINT` when omitted.
- `<spkg>`: a local file, a full URL or `spkg_package@version` (default `ethereum_common@v0.4.0`).
- `<module>`: the output module (default `filtered_events`).
- `<start>:<stop>`: block range, `-1:` means from current head and onwards forever (default is the module's initial block).

| Flag                             | Description                                                              |
|----------------------------------|--------------------------------------------------------------------------|
| `--params=<module>:<expr>[,...]` | Module parameters, same format as the Rust and Java examples.            |
| `--final-blocks-only`            | Only receive irreversible blocks, no `BlockUndoSignal` is ever sent.     |
| `--cursor-file=<path>`           | Where the cursor is persisted (default `data/cursor.txt`).               |

Authentication is done with an API key read from the `SUBSTREAMS_API_KEY` environment variable (sent as the `x-api-key` header).

Example, a short range with a module parameter:

```bash
SUBSTREAMS_API_KEY="<StreamingFast API Key>" uv run python main.py mainnet.eth.streamingfast.io:443 ethereum_common@v0.4.0 filtered_events 21000000:+10 --params="filtered_events:(evt_sig:0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef)"
```

> **Note** `uv` picks the Python version from `.python-version` (3.13) and downloads it if needed. `grpcio` ships native wheels, we hit an `import grpc` failure on CPython 3.14 so pick another interpreter (`uv sync --python 3.13`) if you change it.

## Details

`main.py` is a single file, `consume` runs one gRPC connection and `run` wraps it with automatic reconnection. It returns when the stop block is reached and exits on fatal errors (`UNAUTHENTICATED`, `PERMISSION_DENIED`, `INVALID_ARGUMENT`, handler failure).

### Reconnect & Cursor

1. On startup, the cursor is loaded from the cursor file (if any). Without a cursor, the stream starts at the requested start block.
2. Each block (or undo signal) is handled, and **only once handled without error** is the cursor persisted (atomically replacing the file).
3. Any other failure of the stream triggers a reconnect that sends the last persisted cursor as `start_cursor` (it takes precedence over the start block). A block is thus never skipped nor applied twice. If the process dies in the middle of a `BlockScopedDatas` batch, the not yet handled items are re-delivered.
4. Reconnect uses exponential backoff, starting at 500ms, doubling up to a cap of 45s with ±20% jitter, reset after healthy progress.

The messages come from the `sf.substreams.rpc.v3` `Request` and the `sf.substreams.rpc.v4` `Stream` service, whose `Response` batches blocks in `BlockScopedDatas`.

### Incomplete Implementation

#### Cursor Persistence

The cursor is saved in a local file, which is only suitable for demo purposes. In production, save it in your database, **in the same transaction as the data it corresponds to**, in `load_cursor` and `persist_cursor`.

#### Block Undo Signal

`BlockUndoSignal` must be treated as "delete every data that has been recorded after block height specified by the last valid block". If for example all your added record contain a block number, a simple way is to do `delete all records where block_num > last_valid_block.number` (this is true for append only records, so when only `INSERT` are allowed).

This is left to be implemented by you in `handle_undo`.

> **Warning** It raises `NotImplementedError` (fatal, the process exits) if an undo signal is received, same as the Rust example, so be warned for a production system. Use `--final-blocks-only` to never receive any. Undo signals on Ethereum Mainnet happen around 5-10 times a day, even less so you might miss the fact that they exist when testing.

## Protobuf Generation

Protobuf and gRPC code is generated into `gen/` (committed, so running the example does not require `buf`) by [buf](https://buf.build/) using the official remote plugins pinned in `buf.gen.yaml`: [`protocolbuffers/python`](https://buf.build/protocolbuffers/python), [`protocolbuffers/pyi`](https://buf.build/protocolbuffers/pyi) (type stubs) and [`grpc/python`](https://buf.build/grpc/python). To regenerate it (requires [buf](https://buf.build/docs/installation)), run the command below. Only what the sink needs is generated (see `buf.gen.yaml`): the `rpc` v4 `Stream` service, the `Package`, and the few protos they reference. The generated code requires `protobuf` >= the plugin's version (`7.36.x` for `v36.2`), keep `pyproject.toml` and `buf.gen.yaml` in sync when bumping.

```bash
buf generate
```

To decode your module's output, generate the Protobuf of your `.spkg` too and unpack the `Any` with the generated class, see `handle_block`:

```bash
buf generate --exclude-path="google" <path/to/substream.spkg>#format=binpb
```
