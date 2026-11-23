## Substreams Sink Examples - JS (Node)

This example consumes a Substreams package (specifically, the [Ethereum Explorer](https://substreams.dev/streamingfast/ethereum-explorer/v0.1.2)) using the Substreams JS library in NodeJS.

The [API key](https://substreams.streamingfast.io/documentation/consume/authentication) is provided through an environment variable:

```javascript
const API_KEY = process.env.SUBSTREAMS_API_KEY
```

If you don't have it, set the `SUBSTREAMS_API_KEY` environment variable. Then, you can easily get started:

1. Install the dependencies.

    ```bash
    npm install
    ```

1. Run the script.

    ```bash
    node index.js
    ```