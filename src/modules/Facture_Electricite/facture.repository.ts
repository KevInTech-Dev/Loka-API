import { BaseRepositoryImpl } from "@/common/base.repository";
import { FactureElectricite, FactureElectriciteAttributes } from "@/database/models/FactureElectricite";
import { CreationAttributes } from "sequelize";

export class FactureElecticiteRepository extends BaseRepositoryImpl<FactureElectricite> {
    constructor() {
        super(FactureElectricite)
    }
    //Creer facture Electricite 
    async create(data: CreationAttributes<FactureElectricite>): Promise<FactureElectricite> {
        return this.model.create(data);
    }

    //Find facture Electricite by id
    async findById(id: string) {
        return this.model.findByPk(id);
    }

    //Find all paginated facture Electricite
    async getFactureElectricitePaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.model.findAndCountAll({ offset, limit })
    }

    //Find Facture Electricite By Attribut
    async getFactureElectriciteByAttribut(attribut: keyof FactureElectriciteAttributes, value: string) {
        return this.model.findOne({
            where: {
                [attribut]: value
            }
        });
    }
}