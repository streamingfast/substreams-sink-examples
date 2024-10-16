## Substreams Python Sink Example

Five easy steps:

1. Install dependencies using `poetry install`
1. Generate Python Substreams bindings using `buf generate buf.build/streamingfast/substreams --include-imports --exclude-path=sf/substreams/intern` (requires [buf](https://buf.build/docs/installation))
1. Generate Substreams outputted Protobuf using `buf generate "https://github.com/streamingfast/substreams-solana-spl-token/raw/refs/heads/master/tokens/solana-spl-token-v0.1.0.spkg#format=binpb"` (requires [buf](https://buf.build/docs/installation))

   > If the command crashes on you, you can manually copy Protobuf files like we did in this project and run `buf generate ./proto`.

1. Define an `SF_API_TOKEN` environment variable following instructions at https://docs.substreams.dev/documentation/consume/authentication
1. Run the Python sink using `poetry run python main.py`

#### Caveats

- `cursor` management, each `block_scoped_data` message has a cursor, it should be kept in a variable and also persisted to storage in the event the process crashes/terminate. Save a `cursor` when the `block_scoped_data` is fully re-processed, otherwise if you save the cursor and then save block scoped data but processing crashed in the middle, you will reconnect the stream one block too far.
- gRPC reconnection management, on disconection, the stream should reconnect and should most importantly pass in the `Request` the latest processed cursor.
- Block undo signal management, outside of `block_scoped_data`, there is one very important signal and it's `block_undo_signal` message. It will be sent when some blocks need to be undone.