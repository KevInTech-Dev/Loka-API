import { Transactions } from "@/database/models/Transaction";
import { TransactionResponse } from "@modules/transaction/transaction.type";
import { BaseMapper } from "@/common/mapper/base.mapper";
import { CreateTransactionInput } from "./transaction.schema";

export class TransactionMapper implements BaseMapper<Transactions, TransactionResponse> {
    toResponse(transaction: Transactions): TransactionResponse {
        return {
            id: transaction?.id,
            payment_id: transaction?.payment_id,
            landlord_id: transaction?.landlord_id,
            transaction_type: transaction?.transaction_type,
            transaction_status: transaction?.transaction_status,
            transaction_reference: transaction?.transaction_reference,
            //transaction_date: transaction?.transaction_date,
            amount: transaction?.amount,
            currency: transaction?.currency,
            description: transaction?.description,
            callback_url: transaction?.callback_url,
            metadata: transaction?.metadata
        };
    }

    toEntity(data: CreateTransactionInput): Partial<Transactions> {
        return {
            payment_id: data.payment_id,
            landlord_id: data.landlord_id,
            transaction_type: data.transaction_type,
            transaction_reference: data.transaction_reference,
            amount: data.amount,
            currency: data.currency,
            description: data.description,
        };
    }
}