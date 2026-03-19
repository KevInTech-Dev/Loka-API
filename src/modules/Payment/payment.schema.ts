import {InvoiceType} from "@/enums/InvoiceTypeEnume";
import { PaymentMethodEnum } from "@/enums/PaymentMethodEnum";
import { PaymentProviderEnum } from "@/enums/PaymentProviderEnum";
import { PaymentStatusEnum } from "@/enums/PaymentStatusEnum";
import z from "zod";

const PaymentSchema = z.object({
    landlord_id: z.uuid("Invalid landlord ID format"),
    tenant_id: z.uuid("Invalid tenant ID format"),
    facture_id: z.uuid("Invalid facture ID format"),
    payment_date: z.coerce.date("Invalid payment date format"),
    amount_paid: z.number(),
    facture_type: z.enum(InvoiceType),
    payment_method: z.enum(PaymentMethodEnum),
    payment_provider: z.enum(PaymentProviderEnum),
    payment_status: z.enum(PaymentStatusEnum),
    platform_commission: z.number(),
    landlord_amount: z.number(),
    payer_phone: z.string(),
    payer_email: z.email("Invalid email format"),
    receitpt_number: z.string(),
    payment_notes: z.string().optional(),
    refund_reason: z.string().optional(),
});

const paymentIdSchema = z.object({
    id: z.uuid("Invalid payment ID format"),
});

const paymentPaginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(10),
});

type CreatePaymentInput = z.infer<typeof PaymentSchema> & {
    payment_reference: string;
    refund_at: Date;
}
type PaymentIdParams = z.infer<typeof paymentIdSchema>
type PaymentPaginationParams = z.infer<typeof paymentPaginationSchema>

export {
    PaymentSchema,
    paymentIdSchema,
    paymentPaginationSchema,
    CreatePaymentInput,
    PaymentIdParams,
    PaymentPaginationParams,
}