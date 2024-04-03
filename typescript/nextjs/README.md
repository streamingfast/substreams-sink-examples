## NextJS Example

In this directory you can find an example of a NextJS application using the Substreams JS library with Typescript.

The application uses the basic template provided by the [create-next-app](https://nextjs.org/docs/pages/api-reference/create-next-app) utility.

## Getting Started

1. Install the dependencies:

```bash
npm install
```

1. Open the `constants.js` file, all the configuration variables of the application. Then, update the `TOKEN` variable with your Subtreams API token. If you have previously run the Substreams CLI, you can find the token at the `$SUBSTREAMS_API_TOKEN` environment variable of your system.

```javascript
const TOKEN = "<SUBSTREAMS-TOKEN>"
```

1. You can run the application just like a normal NextJS application:

```bash
npm run dev
```

The application will be now available at the specified port.

## Understanding the Code

1. All the code related to Substreams is in the `substreams` directory. The `startSubstreams` function of the `main.js` file contains the entrypoint of the Substreams logic.

1. The `startSubstreams` function expects several handlers (i.e. functions), which are defined in the `types.ts` file. Every function handles a different response type sent by the Substreams provider:

- `BlockScopedDataHandler`: executed when a new block is sent from the Substreams provider.
- `BlockUndoSignalHandler`: executed after a fork has happened.
- `ModuleProgressHandler`: executed when a new progress message is sent.

```javascript
export type BlockScopedDataHandler = (response: BlockScopedData, registry: IMessageTypeRegistry) => Promise<void>;
export type BlockUndoSignalHandler = (response: BlockUndoSignal) => Promise<void>;
export type ModuleProgressHandler = (response: ModulesProgress) => Promise<void>;
```

You can get more information about the different messages sent by the Substreams proviveder [in the docs](https://substreams.streamingfast.io/documentation/consume/reliability-guarantees).