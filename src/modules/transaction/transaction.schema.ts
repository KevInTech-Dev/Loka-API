import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import z from "zod";

const CreateTransactionSchema = z.object({
    numero_facture: z.string("Invalid invoice number"),
    type_facture: z.enum(InvoiceType)
});

const transactionIdSchema = z.object({
    id: z.uuid("Invalid transaction ID format"),
});

const transactionPaginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(10),
});

type CreateTransactionInput = z.infer<typeof CreateTransactionSchema> //& {
//     transaction_reference: string
//     sender_id?: string;
//     transaction_type: TransactionTypeEnum;
//     transaction_status: string;
//     // transaction_date: Date;
//     amount: number;
//     currency: string;
//     description: string;
//     metadata?: unknown;
// }
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


