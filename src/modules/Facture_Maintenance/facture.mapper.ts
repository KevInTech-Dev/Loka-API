import { BaseMapper } from "@/common/mapper/base.mapper"
import { FactureMaintenance } from "@/database/models/FacturesMaintenance"
import { FactureMaintenanceResponse } from "./facture.type"
import { CreateFactureMaintenanceInput } from "./facture.schema"
import { InvoiceType } from "@/enums/InvoiceTypeEnume"
import { generateIvoiceNumber } from "@/common/generateInvoiceNumber"
import { FactureMaintenanceRepository } from "./facture.repository"


export class FactureMaintenanceMapper implements BaseMapper<FactureMaintenance, FactureMaintenanceResponse> {
    private factureMaintenanceRepository: FactureMaintenanceRepository;

    constructor() {
        this.factureMaintenanceRepository = new FactureMaintenanceRepository();
    }
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
    //const lastInvoiceNumber = await this.factureMaintenanceRepository.getLastInvNumber();
    toEntity(data: CreateFactureMaintenanceInput): Partial<FactureMaintenance> {
        return {
            dateEcheance: data?.dateEcheance,
            dateEmission: new Date(),
            maintenanceId: data?.maintenanceId,
            idTenant: data?.idTenant,
            invoiceType: InvoiceType.FACTURE_MAINTENANCE,
            isTva: false,
            notes: data?.notes,
            numeroFacture: generateIvoiceNumber(),
            status: data?.status,
            totalAPayer: data?.totalAPayer,
            unitLocation: data?.unitLocation
        }
    }
}