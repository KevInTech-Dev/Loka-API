import { BaseModel } from "@/common/models/base.model";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { StatusFactures } from "@/enums/StatusFacturesEnum";

export type FactureAbonnementResponse = BaseModel & {
    landlordId: string;
    totalAPayer: number;
    utilisateurAbonnement: string;
    dateEcheance: Date;
    dateEmission: Date;
    invoiceType: InvoiceType;
    isTva: boolean;
    notes: string;
    numeroFacture: string;
    status: StatusFactures;
}