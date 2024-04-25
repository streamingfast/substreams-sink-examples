import { log } from "@graphprotocol/graph-ts";
import * as assembly from "./pb/assembly";
import { Transaction } from "../generated/schema";

export function handleTransactions(bytes: Uint8Array): void {
    let transactions = assembly.eth.transaction.v1.Transactions.decode(bytes.buffer).transactions;
    if (transactions.length == 0) {
        log.info("No transactions found", []);
        return;
    }

    for (let i = 0; i < transactions.length; i++) {
        let transaction = transactions[i];

        let entity = new Transaction(transaction.hash);
        entity.from = transaction.from;
        entity.to = transaction.to;
        entity.save();
    }
}