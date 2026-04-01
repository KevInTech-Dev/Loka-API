import { RefundStatusEnum } from "@/enums/refundStatusEnum";
import z from "zod";

const RefundSchema = z.object({
    transactionReference: z.string(),
    refundReason: z.string().optional(),
});

const allowRefundSchema = z.object({
    allowRefund: z.boolean(),
});

const refundIdSchema = z.object({
    id: z.uuid('Invalid refund ID format'),
});

const refundPaymentPagination = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(10)
});

type RefundSchemaType = z.infer<typeof RefundSchema>;
type allowRefundSchemaType = z.infer<typeof allowRefundSchema>;
type refundIdSchemaType = z.infer<typeof refundIdSchema>;
type refundPaginationParams = z.infer<typeof refundPaymentPagination>;

export {
    RefundSchema,
    RefundSchemaType,
    allowRefundSchema,
    allowRefundSchemaType,
    refundIdSchema,
    refundIdSchemaType,
    refundPaymentPagination,
    refundPaginationParams
}