## Subtreams Triggers - Importing transactions from the USDT Exchange Substreams.

## Getting Started

1. Install the dependencies:

```bash
npm install
```

2. Generate the Protobuf of the Ethereum Explorer Substreams:

```bash
buf generate --exclude-path="sf/substreams" --type="sf.substreams.cosmos.v1.USDTExchangeList" injective-usdt-volume-v0.1.0.spkg#format=bin
```

