import { CreateFactureAbonnementInput } from "./facture.schema";
import { DuplicateEntryError, NotFoundError } from "@/common/errors";
import { FactureAbonnementMapper } from "./facture.mapper";
import { FactureAbonnementResponse } from "./facture.type";
import { FactureAbonnementRepository } from "./facture.repository";
import { generateIvoiceNumber } from "@/common/generateInvoiceNumber";
import { landLordRepository } from "../landLord/landlord.repository";
import { FactureAbonnementAttributes } from "@/database/models/FactureAbonnment";
import { Transaction } from "sequelize";

export class FactureAbonnementService {
    private factureAbonnementRepository: FactureAbonnementRepository;
    private factureAbonnementMapper: FactureAbonnementMapper;
    private landlordRepository: landLordRepository;

    constructor() {
        this.factureAbonnementRepository = new FactureAbonnementRepository();
        this.factureAbonnementMapper = new FactureAbonnementMapper();
        this.landlordRepository = new landLordRepository();
    }

    // creer une facture pour un abonnement
    createFactureAbonnement = async (datas: CreateFactureAbonnementInput, transaction?: Transaction): Promise<FactureAbonnementResponse> => {
        //verifier l'existance du landlord
        const existingLandorld = await this.landlordRepository.getlandLordById(datas.landlordId);
        if (!existingLandorld) {
            throw new NotFoundError("This landlord");
        }
        // verifier si une facture existe déjà à une date pour un utilisateurAbonnement
        const existingInvoice = await this.factureAbonnementRepository.isThereInvoice("utilisateurAbonnement", datas.utilisateurAbonnement);
        if (existingInvoice) {
            throw new DuplicateEntryError("Invoice already exit");
        }

        //Recuperer la facture recente et ensuite recuperer son numero de facture
        const invoiceObjt = await this.factureAbonnementRepository.getLastInvNumber();

        const invoiceToCreate = await this.factureAbonnementRepository.create(this.factureAbonnementMapper.toEntity({ ...datas, notes: datas.notes, numeroFacture: generateIvoiceNumber(invoiceObjt) }), transaction);
        return this.factureAbonnementMapper.toResponse(invoiceToCreate);
    }

    //Modifier une facture d'abonnement
    updateFactureAbonnement = async (id: string, datas: CreateFactureAbonnementInput) => {
        const existingAbonnement = await this.factureAbonnementRepository.findById(id);
        if (!existingAbonnement) {
            throw new NotFoundError("Subscription invoice");
        }

        const updateAbonnement = await this.factureAbonnementRepository.update(id, datas);
        return this.factureAbonnementMapper.toResponse(updateAbonnement);
    }

    //Recuperer une facture par id
    getInvoiceAbonnementById = async (id: string) => {
        const existingFactureBonnement = await this.factureAbonnementRepository.findById(id);
        if (!existingFactureBonnement) {
            throw new NotFoundError("Subscription invoice");
        }
        return this.factureAbonnementMapper.toResponse(existingFactureBonnement);
    }

    //Recuperer toute les facture
    getAllInvoiceAbonnement = async (page: number, limit: number) => {
        const { rows, count } = await this.factureAbonnementRepository.getFactureAbonnementPaginated(page, limit);
        const mappedData = rows.map((object) => ({
            id: object?.id,
            landlordId: object?.landlordId,
            totalAPayer: object?.totalAPayer,
            utilisateurAbonnement: object?.utilisateurAbonnement,
            dateEcheance: object?.dateEcheance,
            dateEmission: object?.dateEmission,
            invoiceType: object?.invoiceType,
            isTva: object?.isTva,
            numeroFacture: object?.numeroFacture,
            status: object?.status,
            createdAt: object?.createdAt,
            updatedAt: object?.updatedAt
        }))
        return {
            data: mappedData,
            total: count
        }
    };

    //Supprimer un sucbscription innoice by id
    deleteFactureAbonnement = async (id: string): Promise<Boolean> => {
        const existingFactureAbonnement = await this.factureAbonnementRepository.findById(id);
        if (!existingFactureAbonnement) {
            throw new NotFoundError("Subscription invoice")
        }
        await this.factureAbonnementRepository.softDelete(id);
        return true;
    }
}

