import type { IMessageTypeRegistry } from "@bufbuild/protobuf";
export declare function getProtoType(typeName: string, registry: IMessageTypeRegistry): import("@bufbuild/protobuf").MessageType<import("@bufbuild/protobuf").AnyMessage> | undefined;
export declare function getProtoTypeOrThrow(typeName: string, registry: IMessageTypeRegistry, message?: string): import("@bufbuild/protobuf").MessageType<import("@bufbuild/protobuf").AnyMessage>;
//# sourceMappingURL=get-proto-type.d.ts.map