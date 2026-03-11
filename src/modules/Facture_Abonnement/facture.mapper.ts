import { BaseMapper } from "@/common/mapper/base.mapper"
import { FactureAbonnement } from "@/database/models/FactureAbonnment"
import { CreateFactureAbonnementInput } from "./facture.schema"
import { FactureAbonnementResponse } from "./facture.type"


export class FactureAbonnementMapper implements BaseMapper<FactureAbonnement, FactureAbonnementResponse> {

    toResponse(factureAbonnement: FactureAbonnement): FactureAbonnementResponse {
        return {
            id: factureAbonnement?.id,
            landlordId: factureAbonnement?.landlordId,
            totalAPayer: factureAbonnement?.totalAPayer,
            utilisateurAbonnement: factureAbonnement?.utilisateurAbonnement,
            dateEcheance: factureAbonnement?.dateEcheance,
            dateEmission: factureAbonnement?.dateEmission,
            invoiceType: factureAbonnement?.invoiceType,
            isTva: factureAbonnement?.isTva,
            numeroFacture: factureAbonnement?.numeroFacture,
            status: factureAbonnement?.status,
            createdAt: factureAbonnement?.createdAt,
            updatedAt: factureAbonnement?.updatedAt
        }
    }

    toEntity(data: CreateFactureAbonnementInput): Partial<FactureAbonnement> {
        return {

            landlordId: data?.landlordId,
            totalAPayer: data?.totalAPayer,
            utilisateurAbonnement: data?.utilisateurAbonnement,
            dateEcheance: new Date(data?.dateEcheance),
            dateEmission: new Date(),
            invoiceType: data?.invoiceType,
            isTva: false,
            numeroFacture: data?.numeroFacture,
            status: data?.status,
        }
    }
}