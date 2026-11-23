package io.streamingfast.sink;

import sf.substreams.rpc.v2.Service.BlockScopedData;
import sf.substreams.rpc.v2.Service.BlockUndoSignal;

/**
 * Your business logic. The stream persists the cursor only after the matching method returns without throwing, so
 * handlers must be done (and ideally committed) when they return.
 */
interface BlockHandler {

    void onBlock(BlockScopedData data) throws Exception;

    void onUndo(BlockUndoSignal signal) throws Exception;
}
