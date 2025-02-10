import { createPromiseClient } from "@connectrpc/connect";
import { Stream } from "../proto.js";
export function streamBlocks(transport, request, options) {
  const client = createPromiseClient(Stream, transport);
  return client.blocks(request, options);
}
//# sourceMappingURL=stream-blocks.js.map