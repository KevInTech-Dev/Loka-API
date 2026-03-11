import { BaseRepositoryImpl } from "@/common/base.repository";
import { FactureEau, FactureEauAttributes } from "@/database/models/FactureEau";
import { CreationAttributes } from "sequelize";

export class FactureEauRepository extends BaseRepositoryImpl<FactureEau> {
    constructor() {
        super(FactureEau)
    }
    //Creer facture Eau 
    async create(data: CreationAttributes<FactureEau>): Promise<FactureEau> {
        return this.model.create(data);
    }

    //Find facture eau by id
    async findById(id: string) {
        return this.model.findByPk(id);
    }

    //Find all paginated facture eau
    async getFactureEauPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.model.findAndCountAll({ offset, limit })
    }

    //Find Facture Eau By Attribut
    async getFactureEauByAttribut(attribut: keyof FactureEauAttributes, value: string) {
        return this.model.findOne({
            where: {
                [attribut]: value
            }
        });
    }

    async isThereInvoice(idReleveCompteur: keyof FactureEauAttributes, value: string) {
        const aujourdhui = new Date();
        return this.model.findOne({
            where: {
                [idReleveCompteur]: value,
                dateEmission: aujourdhui
            }
        })
    }
}