import { DuplicateEntryError, NotFoundError } from "@/common/errors";
import { FactureEauRepository } from "./facture.repository";
import { FactureEauMapper } from "./facture.mapper";
import { CreateFactureEauInput } from "./facture.schema";
import { FactureEauResponse } from "./facture.type";

export class FactureEauService {
    private factureEauRepository: FactureEauRepository;
    private factureEauMapper: FactureEauMapper;

    constructor() {
        this.factureEauRepository = new FactureEauRepository();
        this.factureEauMapper = new FactureEauMapper();
    }

    // creer une facture 
    createFactureEau = async (datas: CreateFactureEauInput): Promise<FactureEauResponse> => {
        // verifier si une facture existe déjà 
        const existingInvoice = await this.factureEauRepository.isThereInvoice("idReleveCompteur", datas.idReleveCompteur);
        if (existingInvoice) {
            throw new DuplicateEntryError("Invoice already exit");
        }

        const invoiceToCreate = await this.factureEauRepository.create(this.factureEauMapper.toEntity({ ...datas }));
        return this.factureEauMapper.toResponse(invoiceToCreate);
    }

    //Modifier une facture d'Eau
    updateFactureEau = async (id: string, datas: CreateFactureEauInput) => {
        const existingEau = await this.factureEauRepository.findById(id);
        if (!existingEau) {
            throw new NotFoundError("Eau invoice");
        }
        const updateEau = await this.factureEauRepository.update(id, datas);
        return this.factureEauMapper.toResponse(updateEau);
    }

    //Recuperer une facture par id
    getInvoiceEauById = async (id: string) => {
        const existingFactureBonnement = await this.factureEauRepository.findById(id);
        if (!existingFactureBonnement) {
            throw new NotFoundError("Eau invoice");
        }
        return this.factureEauMapper.toResponse(existingFactureBonnement);
    }

    //Recuperer toute les facture
    getAllInvoiceEau = async (page: number, limit: number) => {
        const { rows, count } = await this.factureEauRepository.getFactureEauPaginated(page, limit);
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
    deleteFactureEau = async (id: string): Promise<Boolean> => {
        const existingFactureEau = await this.factureEauRepository.findById(id);
        if (!existingFactureEau) {
            throw new NotFoundError("Eau invoice")
        }
        await this.factureEauRepository.softDelete(id);
        return true;
    }
}

