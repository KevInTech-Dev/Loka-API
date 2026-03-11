import { BaseMapper } from "@/common/mapper/base.mapper"
import { FactureLoyer } from "@/database/models/FactureLoyer"
import { FactureLoyerResponse } from "./facture.type"
import { CreateFactureLoyerInput } from "./facture.schema"


export class FactureLoyerMapper implements BaseMapper<FactureLoyer, FactureLoyerResponse> {
    toResponse(FactureLoyer: FactureLoyer): FactureLoyerResponse {
        return {
            id: FactureLoyer?.id,
            dateEcheance: FactureLoyer?.dateEcheance,
            dateEmission: FactureLoyer?.dateEmission,
            idTenant: FactureLoyer?.idTenant,
            invoiceType: FactureLoyer?.invoiceType,
            isTva: FactureLoyer?.isTva,
            notes: FactureLoyer?.notes,
            numeroFacture: FactureLoyer?.numeroFacture,
            status: FactureLoyer?.status,
            totalAPayer: FactureLoyer?.totalAPayer,
            unitLocation: FactureLoyer?.unitLocation
        }
    }
    toEntity(data: CreateFactureLoyerInput): Partial<FactureLoyer> {
        return {
            dateEcheance: data?.dateEcheance,
            dateEmission: data?.dateEmission,
            idTenant: data?.idTenant,
            invoiceType: data?.invoiceType,
            isTva: data?.isTva,
            notes: data?.notes,
            numeroFacture: data?.numeroFacture,
            status: data?.status,
            totalAPayer: data?.totalAPayer,
            unitLocation: data?.unitLocation
        }
    }
}