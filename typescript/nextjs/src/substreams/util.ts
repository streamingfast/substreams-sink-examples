// Function to inject BigInt.prototype.toJSON function to convert BigInt to string when using JSON.stringify
// without any other artifice.
//
// This function should be called once, at the entrypoint of your program. In this Next.js
// example, we are calling it in the _app.tsx file.
export function injectBigIntToJSON() {
    // Workaround because JS built-in function is not able to convert BigInt
    BigInt.prototype.toJSON = function() { return this.toString() }
}
