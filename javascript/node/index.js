import {
    createRequest,
    streamBlocks,
    createAuthInterceptor,
    createRegistry,
    applyParams,
    fetchSubstream,
    authIssue
} from '@substreams/core';
import { createConnectTransport } from "@connectrpc/connect-node";
import { getCursor } from "./cursor.js";
import { isErrorRetryable } from "./error.js";
import { handleResponseMessage, handleProgressMessage } from "./handlers.js"

const KEY = process.env.SUBSTREAMS_API_KEY
const ENDPOINT = "https://accounts.devnet.sol.streamingfast.io"
const SPKG = "https://spkg.io/v1/packages/common/v0.1.0"
const MODULE = "map_clocks"
const START_BLOCK = '-1'

/*
    Entrypoint of the application.
    Because of the long-running connection, Substreams will disconnect from time to time.
    The application MUST handle disconnections and commit the provided cursor to avoid missing information.
*/
const main = async () => {
    const {token, expires_at} = await authIssue(KEY)

    const pkg = await fetchPackage();
    const registry = createRegistry(pkg);

    const transport = createConnectTransport({
        baseUrl: ENDPOINT,
        interceptors: [createAuthInterceptor(token)],
        useBinaryFormat: true,
        jsonOptions: {
            typeRegistry: registry,
        },
    });

    // The infinite loop handles disconnections. Every time an disconnection error is thrown, the loop will automatically reconnect
    // and start consuming from the latest committed cursor.
    while (true) {
        try {
            await stream(pkg, registry, transport);

            // Break out of the loop when the stream is finished
            break;
        } catch (e) {
            if (!isErrorRetryable(e)) {
              console.log(`A fatal error occurred: ${e}`)
              throw e
            }
            console.log(`A retryable error occurred (${e}), retrying after backoff`)
            console.log(e)
            // Add backoff from a an easy to use library
        }
    }
}

const fetchPackage = async () => {
    return await fetchSubstream(SPKG)
}

const stream = async (pkg, registry, transport) => {
    const request = createRequest({
        substreamPackage: pkg,
        outputModule: MODULE,
        productionMode: true,
        startBlockNum: -1,
        startCursor: await getCursor() ?? undefined
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

main()
