import {
    createRequest,
    streamBlocks,
    createAuthInterceptor,
    createRegistry,
    applyParams,
    fetchSubstream
} from '@substreams/core';
import { createConnectTransport } from "@connectrpc/connect-node";
import { getCursor } from "./cursor.js";
import { isErrorRetryable } from "./error.js";
import { handleResponseMessage, handleProgressMessage } from "./handlers.js"

const TOKEN = "eyJhbGciOiJLTVNFUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzUyMTg3MDAsImp0aSI6IjNkZDY3ODJhLWZhMTEtNGZkOS1iZGM3LTJhZDFjZTMyZGFiZCIsImlhdCI6MTczOTIxODcwMCwiaXNzIjoiZGZ1c2UuaW8iLCJzdWIiOiIwaGF2bzFiYTZkMDM0YWMxYmU5NmQiLCJ2IjoxLCJha2kiOiI0NjRlYWYxNjU0MTU4M2ZhNTNlZDg5NjAyNjdlYTc2NDQ1ZjBkYTUzNGE1ZWFiODMxMzkwYjYxMjJmNDY2MjRiIiwidWlkIjoiMGhhdm8xYmE2ZDAzNGFjMWJlOTZkIn0.aX3zE0D-YxAQTqT7Vo7vBKATOV7SB-gf0Fy5WQ80efw_o4RFLJIneL0glTSB-eM32NvlXrsraorUABB01K7Veg"
const ENDPOINT = "https://mainnet.sol.streamingfast.io:443"
const SPKG = "https://spkg.io/streamingfast/solana_common-v0.3.3.spkg"
const MODULE = "transactions_by_programid_and_account_without_votes"
const START_BLOCK = '319813683'
const STOP_BLOCK = '+10'

/*
    Entrypoint of the application.
    Because of the long-running connection, Substreams will disconnect from time to time.
    The application MUST handle disconnections and commit the provided cursor to avoid missing information.
*/
const main = async () => {
    const pkg = await fetchPackage();
    applyParams(["transactions_by_programid_and_account_without_votes=program:JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4 && account:FBxBr8ySAUVK8rnEyfDsNZ3n48TWEWXWytm7BJ6XFixc"], pkg.modules?.modules);
    const registry = createRegistry(pkg);

    const transport = createConnectTransport({
        baseUrl: ENDPOINT,
        interceptors: [createAuthInterceptor(TOKEN)],
        useBinaryFormat: true,
        jsonOptions: {
            typeRegistry: registry,
        },
    });
    
    // The infite loop handles disconnections. Every time an disconnection error is thrown, the loop will automatically reconnect
    // and start consuming from the latest commited cursor.
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
        startBlockNum: START_BLOCK,
        stopBlockNum: STOP_BLOCK,
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
