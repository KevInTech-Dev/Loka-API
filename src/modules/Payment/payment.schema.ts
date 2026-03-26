import { CurrencyEnum } from "@/enums/Currency";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { PaymentMethodEnum } from "@/enums/PaymentMethodEnum";
import { PaymentProviderEnum } from "@/enums/PaymentProviderEnum";
import { Currency } from "fedapay";
import z from "zod";

const createFedapaySchema = z.object({
    description: z.string(),
    amount: z.number(),
    currency: z.string(),
    //callback_url: z.string(),
    //custom_metadata: z.object(),
    //customer: z.object()
})

const fedapayResponseSchema = z.object({
    id: z.number(),
    reference: z.string(),
    amount: z.number(),
    description: z.string(),
    callbackurl: z.string(),
    status: z.string(),
    createdAt: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).transform((v) => { return new Date(v) }),
    updatedAt: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).transform((v) => { return new Date(v) }),
})

const CreatePaymentSchema = z.object({
    facture_type: z.enum([
        InvoiceType.FACTURE_LOYER,
        InvoiceType.FACTURE_EAU,
        InvoiceType.FACTURE_ELEC,
        InvoiceType.FACTURE_MAINTENANCE,
        InvoiceType.ABONNEMENT,
        InvoiceType.ABONNEMENT_TRIAL,
    ]),
    facture_id: z.uuid("Invalid facture ID format"),
    payment_method: z.enum([
        PaymentMethodEnum.CASH,
        PaymentMethodEnum.ONLINE,
    ]),
    payment_provider: z.enum([
        PaymentProviderEnum.STRIPE,
        PaymentProviderEnum.FEDAPAY,
    ]).default(PaymentProviderEnum.FEDAPAY),
    currency: z.enum([
        "XOF",
        "EUR",
        "USD",
    ]).default("XOF"),
    payer_phone: z.string().min(1, "Phone is required"),
    payer_email: z.string().email("Invalid email format").optional(),
    payment_notes: z.string().optional(),
});

const paymentIdSchema = z.object({
    id: z.uuid("Invalid payment ID format"),
});

const paymentPaginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(10),
});

type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;
type PaymentIdParams = z.infer<typeof paymentIdSchema>;
type PaymentPaginationParams = z.infer<typeof paymentPaginationSchema>;
type CreateFedapaySchema = z.infer<typeof createFedapaySchema>;
type FedapayResponseSchema = z.infer<typeof fedapayResponseSchema>

export {
    CreatePaymentSchema,
    paymentIdSchema,
    paymentPaginationSchema,
    createFedapaySchema,
    fedapayResponseSchema,
    CreatePaymentInput,
    PaymentIdParams,
    PaymentPaginationParams,
    CreateFedapaySchema,
    FedapayResponseSchema
};