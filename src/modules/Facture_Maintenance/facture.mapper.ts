import { BaseMapper } from "@/common/mapper/base.mapper"
import { FactureMaintenance } from "@/database/models/FacturesMaintenance"
import { FactureMaintenanceResponse } from "./facture.type"
import { CreateFactureMaintenanceInput } from "./facture.schema"


export class FactureMaintenanceMapper implements BaseMapper<FactureMaintenance, FactureMaintenanceResponse> {
    toResponse(FactureMaintenance: FactureMaintenance): FactureMaintenanceResponse {
        return {
            id: FactureMaintenance?.id,
            dateEcheance: FactureMaintenance?.dateEcheance,
            dateEmission: FactureMaintenance?.dateEmission,
            maintenanceId: FactureMaintenance?.maintenanceId,
            idTenant: FactureMaintenance?.idTenant,
            invoiceType: FactureMaintenance?.invoiceType,
            isTva: FactureMaintenance?.isTva,
            notes: FactureMaintenance?.notes,
            numeroFacture: FactureMaintenance?.numeroFacture,
            status: FactureMaintenance?.status,
            totalAPayer: FactureMaintenance?.totalAPayer,
            unitLocation: FactureMaintenance?.unitLocation
        }
    }
    toEntity(data: CreateFactureMaintenanceInput): Partial<FactureMaintenance> {
        return {
            dateEcheance: data?.dateEcheance,
            dateEmission: data?.dateEmission,
            maintenanceId: data?.maintenanceId,
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