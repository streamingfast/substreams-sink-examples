import { ProcessRangeRequest, ProcessRangeResponse } from "./service_pb.js";
import { MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service sf.substreams.internal.v2.Substreams
 */
export declare const Substreams: {
    readonly typeName: "sf.substreams.internal.v2.Substreams";
    readonly methods: {
        /**
         * @generated from rpc sf.substreams.internal.v2.Substreams.ProcessRange
         */
        readonly processRange: {
            readonly name: "ProcessRange";
            readonly I: typeof ProcessRangeRequest;
            readonly O: typeof ProcessRangeResponse;
            readonly kind: MethodKind.ServerStreaming;
        };
    };
};
//# sourceMappingURL=service_connect.d.ts.map