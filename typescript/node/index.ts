import {
    createRequest,
    isEmptyMessage,
    unpackMapOutput,
    createAuthInterceptor,
    createRegistry,
    fetchSubstream,
    applyParams,
    streamBlocks,
} from "@substreams/core";
import { createConnectTransport } from "@connectrpc/connect-node";
import { readPackageFromFile } from "@substreams/manifest";

const TOKEN = process.env.SUBSTREAMS_API_TOKEN
const SPKG = "./substreams/substreams-head-tracker-v1.0.0.spkg"
const MODULE = "map_block_meta"

const fetchPackage = async () => {
    if (SPKG.startsWith("http")) {
        return await fetchSubstream(SPKG)
    } else {
        return readPackageFromFile(SPKG)
    }
}

const main = async () => {
    if (TOKEN == undefined) {
        throw "SUBSTREAMS_API_TOKEN is not defined"
    }

    const pkg = await fetchPackage()
    const registry = createRegistry(pkg);

    const transport = createConnectTransport({
        baseUrl: "https://mainnet.eth.streamingfast.io",
        interceptors: [createAuthInterceptor(TOKEN)],
        httpVersion: "2",
    });

    let cursor
    let rangeStart = 100000
    let rangeStop = 100009

    mainLoop: while (true) {
        applyParams([`${MODULE}=Range ${rangeStart} - ${rangeStop}`], pkg.modules!.modules)

        const request = createRequest({
            substreamPackage: pkg,
            outputModule: MODULE,
            productionMode: false,
            startBlockNum: 100000,
            stopBlockNum: "+100",
            startCursor: cursor,
        });

        if (cursor !== undefined) {
            console.log(`Resuming from cursor ${cursor}, waiting 1.5s`)
            console.log()
            await sleep(1500)
        }

        let blockCount = 0
        for await (const response of streamBlocks(transport, request)) {
            const output = unpackMapOutput(response, registry);

            if (output !== undefined && !isEmptyMessage(output)) {
                const outputAsJson = output.toJson({typeRegistry: registry});
                console.log(outputAsJson)
            }

            let msg = response.message
            if (msg.case === "blockScopedData") {
                cursor = msg.value.cursor
                blockCount += 1

                if (blockCount % 10 === 0) {
                    console.log()
                    console.log("Stopping each 10 blocks")
                    rangeStart += 10
                    rangeStop += 10

                    continue mainLoop;
                }
            }
        }

        console.log("Completing")
        break
    }
}

main().catch((e) => { console.error(e); process.exit(1); });

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
