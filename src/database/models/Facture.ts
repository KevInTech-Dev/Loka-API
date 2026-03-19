import {Optional} from "sequelize";
import {BaseModel} from "@common/models/base.model";
import {InvoiceType} from "@/enums/InvoiceTypeEnume";
import {StatusFactures} from "@/enums/StatusFacturesEnum";


export interface FactureAttributes extends BaseModel {

    numeroFacture: string;
    dateEmission: Date;
    invoiceType: InvoiceType;
    dateEcheance: Date;
    status: StatusFactures;
    totalAPayer: number;
    notes?: string;
    isTva: boolean;
}

export interface FactureCreationAttributes extends Optional<
    FactureAttributes,
    "id" | "notes" | "createdAt" | "updatedAt" | "isTva"
> { }