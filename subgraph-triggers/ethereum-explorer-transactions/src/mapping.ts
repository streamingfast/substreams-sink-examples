import { log } from "@graphprotocol/graph-ts";
import { Transactions } from "./pb/eth/transaction/v1/Transactions";
import { Transaction } from "../generated/schema";
import { Protobuf } from 'as-proto/assembly';

export function handleTransactions(bytes: Uint8Array): void {
    const transactionsProto: Transactions = Protobuf.decode<Transactions>(bytes, Transactions.decode);
    const transactions = transactionsProto.transactions;

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