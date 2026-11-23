## Substreams Sink Examples - JS (Browser)

This example consumes a Substreams package (specifically, the [Ethereum Explorer](https://substreams.dev/streamingfast/ethereum-explorer/v0.1.2)) using the Substreams JS library in the browser.

The application uses [Vite](https://vitejs.dev/) to set up a development servers. You can easily get started:

1. Install the dependencies.

```bash
npm run install
```

2. Open the `main.js` and set your Substreams API key in the `API_KEY` variable.
If you have previously run the Substreams CLI, you can find the key at the `$SUBSTREAMS_API_KEY` environment variable of your system.

```javascript
const API_KEY = "<SUBSTREAMS-API-KEY>"
```


3. Run the server.

```bash
npm run dev
```

4. Navigate to `http://localhost:5173/`. The application will start consuming Ethereum blocks.