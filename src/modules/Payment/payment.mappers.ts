import {BaseMapper} from "@/common/mapper/base.mapper";
import {Payment} from "@/database/models/payment";
import {CreatePaymentInput} from "./payment.schema";
import {PaymentResponse} from "@modules/Payment/payment.types";

export class PaymentMapper implements BaseMapper<Payment, PaymentResponse> {
    toResponse(payment: Payment): PaymentResponse {
        return {
            id: payment?.id,
            payment_reference: payment?.payment_reference,
            landlord_id: payment?.landlord_id,
            tenant_id: payment?.tenant_id,
            facture_loy_id: payment?.facture_loy_id,
            facture_ab_id: payment?.facture_ab_id,
            facture_water_id: payment?.facture_water_id,
            facture_elec_id: payment?.facture_elec_id,
            facture_mtn_id: payment?.facture_mtn_id,
            amount_paid: payment?.amount_paid,
            currency: payment?.currency,
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
            factureType: data.facture_type,
            payment_method: data.payment_method,
            payment_provider: data.payment_provider,
            currency: data.currency,
            payer_phone: data.payer_phone,
            payer_email: data.payer_email || "",
            payment_notes: data.payment_notes,
        };
    }
}