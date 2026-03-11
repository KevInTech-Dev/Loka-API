import { BaseMapper } from "@/common/mapper/base.mapper"
import { FactureEau } from "@/database/models/FactureEau"
import { CreateFactureEauInput } from "./facture.schema"
import { FactureEauResponse } from "./facture.type"

export class FactureEauMapper implements BaseMapper<FactureEau, FactureEauResponse> {
    toResponse(FactureEau: FactureEau): FactureEauResponse {
        return {
            id: FactureEau?.id,
            dateEcheance: FactureEau?.dateEcheance,
            dateEmission: FactureEau?.dateEmission,
            idReleveCompteur: FactureEau?.idReleveCompteur,
            idTenant: FactureEau?.idTenant,
            invoiceType: FactureEau?.invoiceType,
            isTva: FactureEau?.isTva,
            notes: FactureEau?.notes,
            numeroFacture: FactureEau?.numeroFacture,
            status: FactureEau?.status,
            totalAPayer: FactureEau?.totalAPayer,
            unitLocation: FactureEau?.unitLocation
        }
    }
    toEntity(data: CreateFactureEauInput): Partial<FactureEau> {
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