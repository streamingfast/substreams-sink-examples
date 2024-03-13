## Substreams Sink Examples - JS (Node)

This example consumes a Substreams package (specifically, the [Ethereum Explorer](https://substreams.dev/streamingfast/ethereum-explorer/v0.1.2)) using the Substreams JS library in NodeJS.

The [API token](https://substreams.streamingfast.io/documentation/consume/authentication) is provided through an environment variable:

```javascript
const TOKEN = process.env.SUBSTREAMS_API_TOKEN
```

If you don't have it, set the `SUBSTREAMS_API_TOKEN` environment variable. Then, you can easily get started:

1. Install the dependencies.

```bash
npm install
```

2. Run the script.

```bash
node index.js
```