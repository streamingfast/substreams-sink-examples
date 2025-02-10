import { Package } from "../proto.js";
export function createSubstream(value) {
  if (value instanceof ArrayBuffer) {
    return Package.fromBinary(new Uint8Array(value));
  }
  return Package.fromBinary(value);
}
//# sourceMappingURL=create-substream.js.map