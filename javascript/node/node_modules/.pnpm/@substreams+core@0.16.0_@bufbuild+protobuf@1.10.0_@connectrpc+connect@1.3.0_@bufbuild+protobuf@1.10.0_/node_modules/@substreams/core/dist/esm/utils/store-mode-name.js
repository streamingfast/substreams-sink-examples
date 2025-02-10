import { proto3 } from "@bufbuild/protobuf";
import { Module_Input_Store_Mode } from "../proto.js";
export function storeModeName(mode) {
  const info = proto3.getEnumType(Module_Input_Store_Mode).findNumber(mode);
  if (info === undefined) {
    throw mode.toString().toLowerCase();
  }
  return info.name.toLowerCase();
}
//# sourceMappingURL=store-mode-name.js.map