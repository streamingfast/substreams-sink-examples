## Subtreams Triggers - Importing transactions from the USDT Exchange Substreams.

## Getting Started

1. Install the dependencies:

```bash
npm install
```

2. Generate the code defined in the mappings

```bash
npm run codegen
```

3. Generate the Protobuf of the Substreams:

```bash
buf generate --exclude-path="sf/substreams" --type="sf.substreams.cosmos.v1.USDTExchangeList" injective-usdt-volume-v0.1.0.spkg#format=bin
```

Alternatively, you can generate from another '.binpb' file

4. Code, build...

```bash
npm run build
```
