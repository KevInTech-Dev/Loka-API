import { BaseTypes } from "@/common/models/base.model";
import { TransactionStatusEnum } from "@/enums/TransactionStatusEnum";
import { TransactionTypeEnum } from "@/enums/TransactionTypeEnum";

export type TransactionResponse = BaseTypes & {
    payment_id: string;
    sender_id?: string | null;
    transaction_type: TransactionTypeEnum;
    transaction_status: string;
    transaction_reference: string
    //transaction_date: Date;
    amount: number;
    currency: string;
    description: string;
    metadata?: unknown;
}