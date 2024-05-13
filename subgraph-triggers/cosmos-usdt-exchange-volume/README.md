## Subtreams Triggers - Importing transactions from the Ethereum Explorer package.

This a basic example of importing a Substreams module into a subgraph using Substreams triggers. The `map_filter_transactions` module of the [Ethereum Explorer](https://github.com/streamingfast/substreams-explorers/tree/main/ethereum-explorer) package is imported and a `Transaction` GraphQL entity is created for every transaction received.

## Getting Started

1. Install the dependencies:

```bash
npm install
```

2. Generate the Protobuf of the Ethereum Explorer Substreams:

```bash
buf generate --exclude-path="sf/substreams" --type="sf.substreams.cosmos.v1.USDTExchangeList" injective-usdt-volume-v0.1.0.spkg#format=bin
```

You can follow the full tutorial in the [Substreams documentation](https://substreams.streamingfast.io/documentation/consume/subgraph/triggers).
