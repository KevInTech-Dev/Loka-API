import { DuplicateEntryError, NotFoundError } from "@/common/errors";
import { FactureMaintenanceMapper } from "./facture.mapper";
import { FactureMaintenanceRepository } from "./facture.repository";
import { CreateFactureMaintenanceInput } from "./facture.schema";
import { FactureMaintenanceResponse } from "./facture.type";

export class FactureMaintenanceService {
    private factureMaintenanceRepository: FactureMaintenanceRepository;
    private factureMaintenanceMapper: FactureMaintenanceMapper;

    constructor() {
        this.factureMaintenanceRepository = new FactureMaintenanceRepository();
        this.factureMaintenanceMapper = new FactureMaintenanceMapper();
    }

    // creer une facture 
    createFactureMaintenance = async (datas: CreateFactureMaintenanceInput): Promise<FactureMaintenanceResponse> => {
        // verifier si une facture existe déjà 
        const existingInvoice = await this.factureMaintenanceRepository.isThereInvoice("idTenant", datas.idTenant);
        if (existingInvoice) {
            throw new DuplicateEntryError("Invoice already exit");
        }

        const invoiceToCreate = await this.factureMaintenanceRepository.create(this.factureMaintenanceMapper.toEntity({ ...datas }));
        return this.factureMaintenanceMapper.toResponse(invoiceToCreate);
    }

    //Modifier une facture d'Maintenance
    updateFactureMaintenance = async (id: string, datas: CreateFactureMaintenanceInput) => {
        const existingMaintenance = await this.factureMaintenanceRepository.findById(id);
        if (!existingMaintenance) {
            throw new NotFoundError("Maintenance invoice");
        }
        const updateMaintenance = await this.factureMaintenanceRepository.update(id, datas);
        return this.factureMaintenanceMapper.toResponse(updateMaintenance);
    }

    //Recuperer une facture par id
    getInvoiceMaintenanceById = async (id: string) => {
        const existingFactureBonnement = await this.factureMaintenanceRepository.findById(id);
        if (!existingFactureBonnement) {
            throw new NotFoundError("Maintenance invoice");
        }
        return this.factureMaintenanceMapper.toResponse(existingFactureBonnement);
    }

    //Recuperer toute les facture
    getAllInvoiceMaintenance = async (page: number, limit: number) => {
        const { rows, count } = await this.factureMaintenanceRepository.getFactureMaintenancePaginated(page, limit);
        const mappedData = rows.map((object) => ({
            id: object?.id,
            dateEcheance: object?.dateEcheance,
            dateEmission: object?.dateEmission,
            idTenant: object?.idTenant,
            invoiceType: object?.invoiceType,
            isTva: object?.isTva,
            notes: object?.notes,
            numeroFacture: object?.numeroFacture,
            status: object?.status,
            totalAPayer: object?.totalAPayer,
            unitLocation: object.unitLocation,
            createdAt: object?.createdAt,
            updatedAt: object?.updatedAt
        }))
        return {
            data: mappedData,
            total: count
        }
    };

    //Supprimer un sucbscription innoice by id
    deleteFactureMaintenance = async (id: string): Promise<Boolean> => {
        const existingFactureMaintenance = await this.factureMaintenanceRepository.findById(id);
        if (!existingFactureMaintenance) {
            throw new NotFoundError("Maintenance invoice")
        }
        await this.factureMaintenanceRepository.softDelete(id);
        return true;
    }
}

