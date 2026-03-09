import { BaseModel } from "@/common/models/base.model";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { StatusFactures } from "@/enums/StatusFacturesEnum";

export type FactureElectriciteResponse = BaseModel & {
    dateEcheance: Date;
    dateEmission: Date;
    idReleveCompteur: string;
    idTenant: string;
    invoiceType: InvoiceType;
    isTva: boolean;
    notes: string;
    numeroFacture: string;
    status: StatusFactures;
    totalAPayer: number;
    unitLocation: string;
}