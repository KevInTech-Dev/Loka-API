import { BaseRepositoryImpl } from "@/common/base.repository";
import { FactureAbonnement, FactureAbonnementAttributes } from "@/database/models/FactureAbonnment";

import { CreationAttributes, Transaction } from "sequelize";


export class FactureAbonnementRepository extends BaseRepositoryImpl<FactureAbonnement> {
    constructor() {
        super(FactureAbonnement);
    }
    //Creer facture abonnment
    async create(data: CreationAttributes<FactureAbonnement>, transaction?: Transaction): Promise<FactureAbonnement> {
        return this.model.create(data, { transaction });
    }



    //Find facture abonnement by id
    async findById(id: string) {
        return this.model.findByPk(id);
    }

    //Find all paginated facture abonnement
    async getFactureAbonnementPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.model.findAndCountAll({ offset, limit })
    }

    //Find Facture Abonnement By Attribut
    async getFactureAbonnementByAttribut(attribut: keyof FactureAbonnementAttributes, value: string) {
        return this.model.findOne({
            where: {
                [attribut]: value
            }
        });
    }

    //Verifier si il existe déjà une facture pour une date précise concernant un utilisateurAbonnement
    async isThereInvoice(utilisateurAbonnement: keyof FactureAbonnementAttributes, value: string) {
        const aujourdhui = new Date();
        return this.model.findOne({
            where: {
                [utilisateurAbonnement]: value,
                dateEmission: aujourdhui
            }
        })
    }

    getLastInvNumber = async (): Promise<number> => {
        return this.model.count()
    }

    checkIfInvoiceNumberExist = async (invoiceNumber: string): Promise<FactureAbonnement> => {
        return this.model.findOne({
            where: {
                numeroFacture: invoiceNumber,
            }
        })
    }

}