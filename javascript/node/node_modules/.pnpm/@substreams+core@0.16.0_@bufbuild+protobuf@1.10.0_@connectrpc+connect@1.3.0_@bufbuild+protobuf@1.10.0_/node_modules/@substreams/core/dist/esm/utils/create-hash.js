export async function createHash(array) {
  const hash = await globalThis.crypto.subtle.digest("SHA-1", array);
  return new Uint8Array(hash);
}
//# sourceMappingURL=create-hash.js.map