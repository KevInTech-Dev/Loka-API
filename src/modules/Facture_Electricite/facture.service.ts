import { DuplicateEntryError, NotFoundError } from "@/common/errors";
import { FactureElectriciteMapper } from "./facture.mapper";
import { CreateFactureElectriciteInput } from "./facture.schema";
import { FactureElectriciteResponse } from "./facture.type";
import { FactureElectriciteRepository } from "./facture.repository";

export class FactureElectriciteService {
    private factureElectriciteRepository: FactureElectriciteRepository;
    private factureElectriciteMapper: FactureElectriciteMapper;

    constructor() {
        this.factureElectriciteRepository = new FactureElectriciteRepository();
        this.factureElectriciteMapper = new FactureElectriciteMapper();
    }

    // creer une facture 
    createFactureElectricite = async (datas: CreateFactureElectriciteInput): Promise<FactureElectriciteResponse> => {
        // verifier si une facture existe déjà 
        const existingInvoice = await this.factureElectriciteRepository.isThereInvoice("idReleveCompteur", datas.idReleveCompteur);
        if (existingInvoice) {
            throw new DuplicateEntryError("Invoice already exit");
        }

        const invoiceToCreate = await this.factureElectriciteRepository.create(this.factureElectriciteMapper.toEntity({ ...datas }));
        return this.factureElectriciteMapper.toResponse(invoiceToCreate);
    }

    //Modifier une facture d'Electricite
    updateFactureElectricite = async (id: string, datas: CreateFactureElectriciteInput) => {
        const existingElectricite = await this.factureElectriciteRepository.findById(id);
        if (!existingElectricite) {
            throw new NotFoundError("Electricite invoice");
        }
        const updateElectricite = await this.factureElectriciteRepository.update(id, datas);
        return this.factureElectriciteMapper.toResponse(updateElectricite);
    }

    //Recuperer une facture par id
    getInvoiceElectriciteById = async (id: string) => {
        const existingFactureBonnement = await this.factureElectriciteRepository.findById(id);
        if (!existingFactureBonnement) {
            throw new NotFoundError("Electricite invoice");
        }
        return this.factureElectriciteMapper.toResponse(existingFactureBonnement);
    }

    //Recuperer toute les facture
    getAllInvoiceElectricite = async (page: number, limit: number) => {
        const { rows, count } = await this.factureElectriciteRepository.getFactureElectricitePaginated(page, limit);
        const mappedData = rows.map((object) => ({
            id: object?.id,
            dateEcheance: object?.dateEcheance,
            dateEmission: object?.dateEmission,
            idReleveCompteur: object?.idReleveCompteur,
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
    deleteFactureElectricite = async (id: string): Promise<Boolean> => {
        const existingFactureElectricite = await this.factureElectriciteRepository.findById(id);
        if (!existingFactureElectricite) {
            throw new NotFoundError("Electricite invoice")
        }
        await this.factureElectriciteRepository.softDelete(id);
        return true;
    }
}

