package io.streamingfast.sink;

import java.time.Duration;
import java.time.Instant;
import sf.substreams.rpc.v2.Service.BlockScopedData;
import sf.substreams.rpc.v2.Service.BlockUndoSignal;

/** Demo handler, replace with your own logic. */
final class SinkHandler implements BlockHandler {

    @Override
    public void onBlock(BlockScopedData data) {
        var output = data.getOutput().getMapOutput();

        // You can decode the actual Any type received using the Java class generated for your module's output
        // Protobuf type:
        //
        //     MyOutput value = output.unpack(MyOutput.class);
        //
        // You will need to generate it (see "Protobuf Generation" in the README) and add it to `src/main/proto`.
        var timestamp = data.getClock().getTimestamp();
        Instant blockTime = Instant.ofEpochSecond(timestamp.getSeconds(), timestamp.getNanos());

        Log.info(
                "  Block #%d - Payload %s (%d bytes) - Drift %ds",
                data.getClock().getNumber(),
                output.getTypeUrl().replace("type.googleapis.com/", ""),
                output.getValue().size(),
                Duration.between(blockTime, Instant.now()).toSeconds());
    }

    @Override
    public void onUndo(BlockUndoSignal signal) {
        // `BlockUndoSignal` must be treated as "delete every data that has been recorded after block height
        // specified by the last valid block". If for example all your records contain a block number, a simple
        // way is to `delete all records where block_num > last_valid_block.number` (true for append only records,
        // so when only `INSERT` are allowed).
        throw new UnsupportedOperationException(
                "you must implement some kind of block undo handling, or request only final blocks (--final-blocks-only)");
    }
}
