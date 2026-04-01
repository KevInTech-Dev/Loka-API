import { BaseTypes } from "@/common/models/base.model";

export type RefundResponse = BaseTypes & {
    transactionReference: string;
    paymentId: string;
    refundReason?: string;
    refundAmount: number;
    refundStatus: string;
    allowRefund: boolean;
}