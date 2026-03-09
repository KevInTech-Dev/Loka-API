import { BaseModel } from "@/common/models/base.model";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { StatusAbonnementEnum } from "@/enums/StatusAbonnement";

export type FactureEauResponse = BaseModel & {
    dateEcheance: Date;
    dateEmission: Date;
    idReleveCompteur: string;
    idTenant: string;
    invoiceType: InvoiceType;
    isTva: boolean;
    notes: string;
    numeroFacture: string;
    status: StatusAbonnementEnum;
    totalAPayer: number;
    unitLocation: string;
}