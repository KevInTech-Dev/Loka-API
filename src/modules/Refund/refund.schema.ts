import { RefundStatusEnum } from "@/enums/refundStatusEnum";
import z from "zod";

const RefundSchema = z.object({
    refundReason: z.string().optional(),
});

const allowRefundSchema = z.object({
    allowRefund: z.boolean(),
});

const refundIdSchema = z.object({
    id: z.uuid('Invalid refund ID format'),
});

const refundPaymentPagination = z.object({
    page: z.number(),
    limit: z.number()
})
type RefundSchemaType = z.infer<typeof RefundSchema> & {
    transactionReference: string;
    paymentId: string;
    refundAmount: number;
    refundStatus: RefundStatusEnum;
    allowRefund: boolean;
};
type allowRefundSchemaType = z.infer<typeof allowRefundSchema> & {
    transactionReference: string;
    paymentId: string;
    refundAmount: number;
    refundStatus: RefundStatusEnum;
    refundReason?: string;
};
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