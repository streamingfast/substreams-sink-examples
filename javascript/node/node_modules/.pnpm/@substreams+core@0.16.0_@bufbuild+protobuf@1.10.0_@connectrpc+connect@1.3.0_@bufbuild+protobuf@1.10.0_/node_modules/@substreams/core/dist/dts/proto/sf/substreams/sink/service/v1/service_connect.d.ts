import { DeployRequest, DeployResponse, InfoRequest, InfoResponse, ListRequest, ListResponse, PauseRequest, PauseResponse, RemoveRequest, RemoveResponse, ResumeRequest, ResumeResponse, StopRequest, StopResponse, UpdateRequest, UpdateResponse } from "./service_pb.js";
import { MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service sf.substreams.sink.service.v1.Provider
 */
export declare const Provider: {
    readonly typeName: "sf.substreams.sink.service.v1.Provider";
    readonly methods: {
        /**
         * @generated from rpc sf.substreams.sink.service.v1.Provider.Deploy
         */
        readonly deploy: {
            readonly name: "Deploy";
            readonly I: typeof DeployRequest;
            readonly O: typeof DeployResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc sf.substreams.sink.service.v1.Provider.Update
         */
        readonly update: {
            readonly name: "Update";
            readonly I: typeof UpdateRequest;
            readonly O: typeof UpdateResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc sf.substreams.sink.service.v1.Provider.Info
         */
        readonly info: {
            readonly name: "Info";
            readonly I: typeof InfoRequest;
            readonly O: typeof InfoResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc sf.substreams.sink.service.v1.Provider.List
         */
        readonly list: {
            readonly name: "List";
            readonly I: typeof ListRequest;
            readonly O: typeof ListResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc sf.substreams.sink.service.v1.Provider.Pause
         */
        readonly pause: {
            readonly name: "Pause";
            readonly I: typeof PauseRequest;
            readonly O: typeof PauseResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc sf.substreams.sink.service.v1.Provider.Stop
         */
        readonly stop: {
            readonly name: "Stop";
            readonly I: typeof StopRequest;
            readonly O: typeof StopResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc sf.substreams.sink.service.v1.Provider.Resume
         */
        readonly resume: {
            readonly name: "Resume";
            readonly I: typeof ResumeRequest;
            readonly O: typeof ResumeResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc sf.substreams.sink.service.v1.Provider.Remove
         */
        readonly remove: {
            readonly name: "Remove";
            readonly I: typeof RemoveRequest;
            readonly O: typeof RemoveResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
//# sourceMappingURL=service_connect.d.ts.map