import { BaseRepositoryImpl } from "@/common/base.repository";
import { FactureAbonnement, FactureAbonnementAttributes } from "@/database/models/FactureAbonnment";
import { CreateFactureAbonnementInput } from "./facture.schema";
import { CreationAttributes } from "sequelize";

export class factureAbonnementRepository extends BaseRepositoryImpl<FactureAbonnement> {
    constructor() {
        super(FactureAbonnement)
    }
    //Creer facture abonnment
    async create(data: CreationAttributes<FactureAbonnement>): Promise<FactureAbonnement> {
        return this.model.create(data);
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

}