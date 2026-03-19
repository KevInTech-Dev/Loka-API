import {BaseMapper} from "@/common/mapper/base.mapper";
import {Payment} from "@/database/models/payment";
import {PaymentResponse} from "@modules/Payment/payment.types";
import {CreatePaymentInput} from "./payment.schema";


export class PaymentMapper implements BaseMapper<Payment, PaymentResponse> {
    toResponse(payment: Payment): PaymentResponse {
        return {
            id: payment?.id,
            payment_reference: payment?.payment_reference,
            landlord_id: payment?.landlord_id,
            tenant_id: payment?.tenant_id,
            facture_id: payment?.facture_id,
            amount_paid: payment?.amount_paid,
            payment_date: payment?.payment_date || new Date(),
            factureType: payment?.factureType,
            payment_method: payment?.payment_method,
            payment_provider: payment?.payment_provider,
            payment_status: payment?.payment_status,
            platform_commission: payment?.platform_commission,
            landlord_amount: payment?.landlord_amount,
            payer_phone: payment?.payer_phone,
            payer_email: payment?.payer_email,
            receitpt_number: payment?.receitpt_number,
            payment_notes: payment?.payment_notes,
            refund_reason: payment?.refund_reason,
            refund_at: payment?.refund_at,
        };
    }

    toEntity(data: CreatePaymentInput): Partial<Payment> {
        return {
            payment_reference: data.payment_reference,
            landlord_id: data.landlord_id,
            tenant_id: data.tenant_id,
            facture_id: data.facture_id,
            amount_paid: data.amount_paid,
            payment_date: data.payment_date,
            factureType: data.facture_type,
            payment_method: data.payment_method,
            payment_provider: data.payment_provider,
            payment_status: data.payment_status,
            platform_commission: data.platform_commission,
            landlord_amount: data.landlord_amount,
            payer_phone: data.payer_phone,
            payer_email: data.payer_email,
            receitpt_number: data.receitpt_number,
            payment_notes: data.payment_notes,
            refund_reason: data.refund_reason,
            refund_at: data.refund_at,
        };
    }
}