import { type IMessageTypeRegistry } from "@bufbuild/protobuf";
import type { BlockScopedData, BlockUndoSignal, ModulesProgress } from '@substreams/core/proto';

export type BlockScopedDataHandler = (response: BlockScopedData, registry: IMessageTypeRegistry) => Promise<void>;
export type BlockUndoSignalHandler = (response: BlockUndoSignal) => Promise<void>;
export type ModuleProgressHandler = (response: ModulesProgress) => Promise<void>;

export class Handlers {
    blockScopedDataHandler: BlockScopedDataHandler;
    blockUndoSignalHandler: BlockUndoSignalHandler;
    moduleProgressHandler: ModuleProgressHandler;

    constructor(
        blockScopedDataHandler: BlockScopedDataHandler,
        blockUndoSignalHandler: BlockUndoSignalHandler, 
        moduleProgressHandler: ModuleProgressHandler
    ) {
        this.blockScopedDataHandler = blockScopedDataHandler;
        this.blockUndoSignalHandler = blockUndoSignalHandler;
        this.moduleProgressHandler = moduleProgressHandler;
    }
}
