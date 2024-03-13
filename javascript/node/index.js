import {
    createRequest,
    isEmptyMessage,
    streamBlocks,
    createAuthInterceptor,
    createRegistry,
    fetchSubstream
} from '@substreams/core';
import { createConnectTransport } from "@connectrpc/connect-node";
import fs from "fs";

const TOKEN = process.env.SUBSTREAMS_API_TOKEN
const ENDPOINT = "https://mainnet.eth.streamingfast.io"
const SPKG = "https://storage.googleapis.com/substreams-registry/spkg/ethereum-explorer-v0.1.1.spkg"
const MODULE = "map_block_meta"
const CURSOR_FILE = "cursor"
const START_BLOCK = '100000'
const STOP_BLOCK = '+10000'

const fetchPackage = async () => {
    return await fetchSubstream(SPKG)
}

const getCursor = async () => {
    return fs.promises.readFile(CURSOR_FILE)
}

// In this example, the cursor is persisted in a file.
const writeCursor = async cursor => {
    try {
        await fs.promises.writeFile(CURSOR_FILE, cursor)
    } catch (e) {
        throw new Error("COULD_NOT_COMMIT_CURSOR")
    }
}

const unpackAndCommitCursor = async (response, registry) => {
  if (response.message.case === "blockScopedData") {
    const output = response.message.value.output?.mapOutput;
    const cursor = response.message.value.cursor;

    await writeCursor(cursor);

    if (output !== undefined) {
      const message = output.unpack(registry);
      if (message === undefined) {
        throw new Error(`Failed to unpack output of type ${output.typeUrl}`);
      }

      return message;
    }
  }

  return undefined;
}

const stream = async (pkg, registry, transport) => {
    const request = createRequest({
        substreamPackage: pkg,
        outputModule: MODULE,
        productionMode: true,
        startBlockNum: START_BLOCK,
        stopBlockNum: STOP_BLOCK,
        startCursor: await getCursor() ?? undefined
    });
    
    // Stream the blocks
    for await (const response of streamBlocks(transport, request)) {
        // Decode the response and commit the cursor
        const output = await unpackAndCommitCursor(response.response, registry);

        if (output !== undefined && !isEmptyMessage(output)) {
            const outputAsJson = output.toJson({typeRegistry: registry});
            console.log(outputAsJson)
        }
    }
}

/*
    Entrypoint of the application.
    Because of the long-running connection, Substreams will disconnect from time to time.
    The application MUST handle disconnections and commit the provided cursor to avoid missing information.
*/
const main = async () => {
    const pkg = await fetchPackage()
    const registry = createRegistry(pkg);

    const transport = createConnectTransport({
        baseUrl: ENDPOINT,
        interceptors: [createAuthInterceptor(TOKEN)],
        useBinaryFormat: true,
        jsonOptions: {
            typeRegistry: registry,
        },
    });

    let running = true;
    
    // The infite loop handles disconnections. Every time an disconnection error is thrown, the loop will automatically reconnect
    // and start consuming from the latest commited cursor.
    while (running) {
        try {
            running = false;
            await stream(pkg, registry, transport);
        } catch (e) {
            console.log(e)
        }
    }
}

main()
