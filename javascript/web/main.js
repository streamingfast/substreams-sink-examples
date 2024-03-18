import {
  createRequest,
  isEmptyMessage,
  streamBlocks,
  createAuthInterceptor,
  createRegistry,
  fetchSubstream
} from '@substreams/core';
import { createConnectTransport } from "@connectrpc/connect-web";
import { getCursor, writeCursor } from "./cursor.js"
import { isErrorUnresolvable } from "./error.js"

const TOKEN = "<SUBSTREAMS-TOKEN>"
const ENDPOINT = "https://mainnet.eth.streamingfast.io"
const SPKG = "https://spkg.io/streamingfast/ethereum-explorer-v0.1.2.spkg"
const MODULE = "map_block_meta"
const START_BLOCK = '100000'
const STOP_BLOCK = '+10000'

const updateDOM = (output, cursor) => {
  const outputDiv = document.getElementById('output');
  outputDiv.insertBefore(document.createTextNode(JSON.stringify(output)), outputDiv.firstChild)

  const cursorDiv = document.getElementById('last-cursor');
  cursorDiv.textContent = cursor;
}

const fetchPackage = async () => {
  return await fetchSubstream(SPKG);
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
      startCursor: getCursor() ?? undefined
  });
  
  // Stream the blocks
  for await (const response of streamBlocks(transport, request)) {
      // Decode the response and commit the cursor
      const output = await unpackAndCommitCursor(response.response, registry);

      if (output !== undefined && !isEmptyMessage(output)) {
          const outputAsJson = output.toJson({typeRegistry: registry});
          updateDOM(outputAsJson, await getCursor());
      }
  }
}

/*
  Entrypoint of the application.
  Because of the long-running connection, Substreams will disconnect from time to time.
  The application MUST handle disconnections and commit the provided cursor to avoid missing information.
*/
const executeStreaming = async () => {
  const pkg = await fetchPackage();
  const registry = createRegistry(pkg);

  const transport = createConnectTransport({
      baseUrl: ENDPOINT,
      interceptors: [createAuthInterceptor(TOKEN)],
      useBinaryFormat: true,
      jsonOptions: {
          typeRegistry: registry,
      },
  });
  
  let streamingRunning = true;

  // The infite loop handles disconnections. Every time an disconnection error is thrown, the loop will automatically reconnect
  // and start consuming from the latest commited cursor.
  while (streamingRunning) {
      try {
          streamingRunning = false;
          await stream(pkg, registry, transport);
      } catch (e) {
          if (!isErrorUnresolvable(e)) {
            running = true;
          }

          console.log(e)
      }
  }
}

executeStreaming();