import { DuplicateEntryError, NotFoundError } from "@/common/errors";
import { FactureLoyerMapper } from "./facture.mapper";
import { FactureLoyerRepository } from "./facture.repository";
import { CreateFactureLoyerInput } from "./facture.schema";
import { FactureLoyerResponse } from "./facture.type";

export class FactureLoyerService {
    private factureLoyerRepository: FactureLoyerRepository;
    private factureLoyerMapper: FactureLoyerMapper;

    constructor() {
        this.factureLoyerRepository = new FactureLoyerRepository();
        this.factureLoyerMapper = new FactureLoyerMapper();
    }

    // creer une facture 
    createFactureLoyer = async (datas: CreateFactureLoyerInput): Promise<FactureLoyerResponse> => {
        // verifier si une facture existe déjà 
        const existingInvoice = await this.factureLoyerRepository.isThereInvoice("idTenant", datas.idTenant);
        if (existingInvoice) {
            throw new DuplicateEntryError("Invoice already exit");
        }

        const invoiceToCreate = await this.factureLoyerRepository.create(this.factureLoyerMapper.toEntity({ ...datas }));
        return this.factureLoyerMapper.toResponse(invoiceToCreate);
    }

    //Modifier une facture d'Loyer
    updateFactureLoyer = async (id: string, datas: CreateFactureLoyerInput) => {
        const existingLoyer = await this.factureLoyerRepository.findById(id);
        if (!existingLoyer) {
            throw new NotFoundError("Loyer invoice");
        }
        const updateLoyer = await this.factureLoyerRepository.update(id, datas);
        return this.factureLoyerMapper.toResponse(updateLoyer);
    }

    //Recuperer une facture par id
    getInvoiceLoyerById = async (id: string) => {
        const existingFactureBonnement = await this.factureLoyerRepository.findById(id);
        if (!existingFactureBonnement) {
            throw new NotFoundError("Loyer invoice");
        }
        return this.factureLoyerMapper.toResponse(existingFactureBonnement);
    }

    //Recuperer toute les facture
    getAllInvoiceLoyer = async (page: number, limit: number) => {
        const { rows, count } = await this.factureLoyerRepository.getFactureLoyerPaginated(page, limit);
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
    deleteFactureLoyer = async (id: string): Promise<Boolean> => {
        const existingFactureLoyer = await this.factureLoyerRepository.findById(id);
        if (!existingFactureLoyer) {
            throw new NotFoundError("Loyer invoice")
        }
        await this.factureLoyerRepository.softDelete(id);
        return true;
    }
}

