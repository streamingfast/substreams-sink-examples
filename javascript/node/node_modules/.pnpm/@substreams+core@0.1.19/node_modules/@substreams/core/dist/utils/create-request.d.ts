import { Module, Package, Request } from "../proto.js";
export type CreateRequestOptions = {
    /**
     * The substream package to use.
     */
    substreamPackage: Package;
    /**
     * The output module to use.
     */
    outputModule: Module | string;
    /**
     * Whether to use production mode.
     */
    productionMode?: boolean | undefined;
    /**
     * The cursor to start at.
     */
    startCursor?: string | undefined;
    /**
     * Whether to only include final blocks.
     */
    finalBlocksOnly?: boolean | undefined;
    /**
     * The relative or absolute block number to start at.
     *
     * If a relative offset is provided in the form of a negative integer (e.g. -1000 or -1000n), it is
     * subtracted from the latest block number (chain head) at the time of request creation.
     */
    startBlockNum?: number | bigint | undefined;
    /**
     * The relative or absolute block number to stop at.
     *
     * If a relative offset is provided in the form of a `+` prefixed string (e.g. `+5000`), it is added to
     * the start block number.
     *
     * Relative offsets are only supported if the given start block number is a positive integer.
     */
    stopBlockNum?: number | bigint | `+${number}` | undefined;
    /**
     * Available only in developer mode.
     */
    debugInitialStoreSnapshotForModules?: string[] | undefined;
};
export declare function createRequest({ substreamPackage, outputModule, startBlockNum, stopBlockNum, productionMode, startCursor, finalBlocksOnly, debugInitialStoreSnapshotForModules, }: CreateRequestOptions): Request;
//# sourceMappingURL=create-request.d.ts.map