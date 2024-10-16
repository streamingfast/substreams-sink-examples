## Substreams Python Sink Example

Five easy steps:

1. Install dependencies using `poetry install`
1. Generate Python Substreams bindings using `buf generate buf.build/streamingfast/substreams --include-imports --exclude-path=sf/substreams/intern` (requires [buf](https://buf.build/docs/installation))
1. Generate Substreams outputted Protobuf using `buf generate "https://github.com/streamingfast/substreams-solana-spl-token/raw/refs/heads/master/tokens/solana-spl-token-v0.1.0.spkg#format=binpb"` (requires [buf](https://buf.build/docs/installation))

   > If the command crashes on you, you can manually copy Protobuf files like we did in this project and run `buf generate ./proto`.

1. Define an `SF_API_TOKEN` environment variable following instructions at https://docs.substreams.dev/documentation/consume/authentication
1. Run the Python sink using `poetry run python main.py`
