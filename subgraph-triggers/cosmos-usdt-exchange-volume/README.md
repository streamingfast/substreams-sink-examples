# Subtreams Triggers - Importing transactions from the USDT Exchange Substreams.

## Getting Started

1. Prepare the substreams

The [injective-common](https://substreams.dev/streamingfast/injective-common/v0.1.0) substreams has a `filtered_events` module that allows getting only the events that match certain types.

We will prepare a substreams package file (.spkg) with that parameter baked-in. Here, we want the event type `wasm`:

```yaml
# substreams.yaml
specVersion: v0.1.0
package:
  name: wasm_events
  version: v0.1.0

network: injective-mainnet
imports:
  injective: https://spkg.io/streamingfast/injective-common-v0.1.0.spkg

modules:
  - name: wasm_events
    use: injective:filtered_events

params:
  wasm_events: "wasm"
```

Using substreams v1.7.2 or above (https://github.com/streamingfast/substreams/releases), build the package:

```bash
substreams pack
```

This creates the `wasm-events-v0.1.0.spkg` file in the local folder, which will be referenced by subgraph.yaml.


2. Install the dependencies:

```bash
npm install
```

3. Generate the code defined in the mappings

```bash
npm run codegen
```

4. Generate the Protobuf of the EventList that substreams outputs (and its dependencies):

```bash
# you probably want to delete the previous bindings
# rm -rf src/pb
buf generate --type="sf.substreams.cosmos.v1.EventList"  wasm-events-v0.1.0.spkg#format=bin
```

5. Code your subgraph in `mappings.ts`, build it, deploy it on a local graph-node instance connected to injective-mainnet:

```bash
npm run build
npm run create-local
npm run deploy-local
# npm run remove-local
```

6. Publish to The Graph network:

```bash
npm run publish
```

