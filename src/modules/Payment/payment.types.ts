import { BaseTypes } from "@/common/models/base.model";
import { FactureTypeEnum } from "@/enums/FactureTypeEnum";
import { PaymentMethodEnum } from "@/enums/PaymentMethodEnum";
import { PaymentProviderEnum } from "@/enums/PaymentProviderEnum";
import { PaymentStatusEnum } from "@/enums/PaymentStatusEnum";

export type PaymentResponse = BaseTypes & {
    payment_reference: string;
    landlord_id: string;
    tenant_id: string;
    facture_id: string;
    amount_paid: number;
    payment_date: Date;
    factureType: FactureTypeEnum;
    payment_method: PaymentMethodEnum;
    payment_provider: PaymentProviderEnum;
    payment_status: PaymentStatusEnum;
    platform_commission: number;
    landlord_amount: number;
    payer_phone: string;
    payer_email: string;
    receitpt_number: string;
    payment_notes?: string;
    refund_reason?: string;
    refund_at: Date;
}