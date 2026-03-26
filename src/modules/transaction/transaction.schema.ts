import { TransactionStatusEnum } from "@/enums/TransactionStatusEnum";
import { TransactionTypeEnum } from "@/enums/TransactionTypeEnum";
import z from "zod";

const CreateTransactionSchema = z.object({
    payment_id: z.uuid("Invalid payment ID format"),
});

const transactionIdSchema = z.object({
    id: z.uuid("Invalid transaction ID format"),
});

const transactionPaginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(10),
});

type CreateTransactionInput = z.infer<typeof CreateTransactionSchema> & {
    transaction_reference: string
    sender_id?: string;
}
type TransactionIdParams = z.infer<typeof transactionIdSchema>;
type TransactionPaginationParams = z.infer<typeof transactionPaginationSchema>;


export {
    CreateTransactionSchema,
    transactionIdSchema,
    transactionPaginationSchema,
    CreateTransactionInput,
    TransactionIdParams,
    TransactionPaginationParams,
}


