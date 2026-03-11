import { BaseMapper } from "@/common/mapper/base.mapper"
import { FactureElectricite } from "@/database/models/FactureElectricite"
import { FactureElectriciteResponse } from "./facture.type"
import { CreateFactureElectriciteInput } from "./facture.schema"

export class FactureElectriciteMapper implements BaseMapper<FactureElectricite, FactureElectriciteResponse> {
    toResponse(FactureElectricite: FactureElectricite): FactureElectriciteResponse {
        return {
            id: FactureElectricite?.id,
            dateEcheance: FactureElectricite?.dateEcheance,
            dateEmission: FactureElectricite?.dateEmission,
            idReleveCompteur: FactureElectricite?.idReleveCompteur,
            idTenant: FactureElectricite?.idTenant,
            invoiceType: FactureElectricite?.invoiceType,
            isTva: FactureElectricite?.isTva,
            notes: FactureElectricite?.notes,
            numeroFacture: FactureElectricite?.numeroFacture,
            status: FactureElectricite?.status,
            totalAPayer: FactureElectricite?.totalAPayer,
            unitLocation: FactureElectricite?.unitLocation
        }
    }
    toEntity(data: CreateFactureElectriciteInput): Partial<FactureElectricite> {
        return {
            dateEcheance: data?.dateEcheance,
            dateEmission: data?.dateEmission,
            idReleveCompteur: data?.idReleveCompteur,
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