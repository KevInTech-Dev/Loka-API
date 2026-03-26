import { TransactionStatusEnum } from "@/enums/TransactionStatusEnum";
import { TransactionTypeEnum } from "@/enums/TransactionTypeEnum";
import z from "zod";
import { meta } from "zod/v4/core";

const CreateTransactionSchema = z.object({
    payment_id: z.uuid("Invalid payment ID format"),
    landlord_id: z.uuid("Invalid landlord ID format").optional(),
    transaction_type: z.enum(TransactionTypeEnum),
    amount: z.number().positive(),
    currency: z.string().length(3),
    description: z.string(),
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


