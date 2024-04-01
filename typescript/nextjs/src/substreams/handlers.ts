import { Handlers } from "./types.js";
import { IMessageTypeRegistry } from "@bufbuild/protobuf";

export const handleResponseMessage = async (message: any, registry: IMessageTypeRegistry, handlers: Handlers) => {
    switch(message.case) {
        case "blockScopedData":
            return await handlers.blockScopedDataHandler(message.value, registry)
        case "blockUndoSignal":
            return await handlers.blockUndoSignalHandler(message.value);
        case "progress":
            return await handlers.moduleProgressHandler(message.value)
    }
}