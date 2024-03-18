export const objectToJsonString = obj => {
    /*
        Workaround because JS built-in function is not able to convert BigInt
        https://github.com/GoogleChromeLabs/jsbi/issues/30
    */
    BigInt.prototype.toJSON = function() { return this.toString() }

    return JSON.stringify(obj)
}