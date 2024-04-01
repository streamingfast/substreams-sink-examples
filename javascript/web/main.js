import {
  createRequest,
  streamBlocks,
  createAuthInterceptor,
  createRegistry,
  fetchSubstream
} from '@substreams/core';
import { createConnectTransport } from "@connectrpc/connect-web";
import { getCursor } from "./cursor.js"
import { handleResponseMessage, handleProgressMessage } from "./handlers.js"
import { isErrorRetryable } from "./error.js"

const TOKEN = "<SUBSTREAMS-TOKEN>"
const ENDPOINT = "https://mainnet.eth.streamingfast.io"
const SPKG = "https://spkg.io/streamingfast/ethereum-explorer-v0.1.2.spkg"
const MODULE = "map_block_meta"
const START_BLOCK = '100000'
const STOP_BLOCK = '+10000'

/*
  Entrypoint of the application.
  Because of the long-running connection, Substreams will disconnect from time to time.
  The application MUST handle disconnections and commit the provided cursor to avoid missing information.
*/
const main = async () => {
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
  
  let streaming = true;

  // The infite loop handles disconnections. Every time an disconnection error is thrown, the loop will automatically reconnect
  // and start consuming from the latest commited cursor.
  while (streaming) {
      try {
          streaming = false;
          await stream(pkg, registry, transport);
      } catch (e) {
          if (!isErrorRetryable(e)) {
            console.log(`A fatal error occurred: ${e}`)
            throw e
          }
          console.log(`A retryable error occurred (${e}), retrying after backoff`)
          console.log(e)
          streaming = true;
      }
  }
}

const fetchPackage = async () => {
  return await fetchSubstream(SPKG);
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
       /*
            Decode the response and handle the message.
            There different types of response messages that you can receive. You can read more about the response message in the docs:
            https://substreams.streamingfast.io/documentation/consume/reliability-guarantees#the-response-format
        */
        await handleResponseMessage(response.message, registry);
  }
}

main();