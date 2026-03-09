import { BaseModel } from "@/common/models/base.model";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { StatusFactures } from "@/enums/StatusFacturesEnum";

export type FactureMaintenanceResponse = BaseModel & {
    dateEcheance: Date;
    dateEmission: Date;
    idTenant: string;
    invoiceType: InvoiceType;
    isTva: boolean;
    maintenanceId: string;
    notes: string;
    numeroFacture: string;
    totalAPayer: number;
    status: StatusFactures;
    unitLocation: string;
}