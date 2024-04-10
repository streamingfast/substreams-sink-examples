import { Handlers } from "./types.js";
import { IMessageTypeRegistry } from "@bufbuild/protobuf";

export const handleResponseMessage = (message: any, registry: IMessageTypeRegistry, handlers: Handlers) => {
    switch(message.case) {
        case "blockScopedData":
            return handlers.blockScopedDataHandler(message.value, registry)
        case "blockUndoSignal":
            return handlers.blockUndoSignalHandler(message.value);
        case "progress":
            return handlers.moduleProgressHandler(message.value)
    }
}