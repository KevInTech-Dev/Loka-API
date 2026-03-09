import { BaseModel } from "@/common/models/base.model";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { StatusFactures } from "@/enums/StatusFacturesEnum";

export type FactureLoyerResponse = BaseModel & {
    numeroFacture: string;
    dateEmission: Date;
    invoiceType: InvoiceType;
    dateEcheance: Date;
    status: StatusFactures;
    notes?: string;
    isTva: boolean;
    unitLocation: string;
    idTenant: string;
    totalAPayer: number;
}