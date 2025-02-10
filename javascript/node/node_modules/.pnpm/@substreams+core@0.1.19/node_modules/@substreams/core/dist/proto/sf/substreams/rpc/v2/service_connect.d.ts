import { Request, Response } from "./service_pb.js";
import { MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service sf.substreams.rpc.v2.Stream
 */
export declare const Stream: {
    readonly typeName: "sf.substreams.rpc.v2.Stream";
    readonly methods: {
        /**
         * @generated from rpc sf.substreams.rpc.v2.Stream.Blocks
         */
        readonly blocks: {
            readonly name: "Blocks";
            readonly I: typeof Request;
            readonly O: typeof Response;
            readonly kind: MethodKind.ServerStreaming;
        };
    };
};
//# sourceMappingURL=service_connect.d.ts.map