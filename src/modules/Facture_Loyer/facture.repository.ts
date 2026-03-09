import { BaseRepositoryImpl } from "@/common/base.repository";
import { FactureLoyer, FactureLoyerAttributes } from "@/database/models/FactureLoyer";
import { CreationAttributes } from "sequelize";


export class FactureLoyerRepository extends BaseRepositoryImpl<FactureLoyer> {
    constructor() {
        super(FactureLoyer)
    }
    //Creer facture Loyer 
    async create(data: CreationAttributes<FactureLoyer>): Promise<FactureLoyer> {
        return this.model.create(data);
    }

    //Find facture Loyer by id
    async findById(id: string) {
        return this.model.findByPk(id);
    }

    //Find all paginated facture Loyer
    async getFactureLoyerPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.model.findAndCountAll({ offset, limit })
    }

    //Find Facture Loyer By Attribut
    async getFactureLoyerByAttribut(attribut: keyof FactureLoyerAttributes, value: string) {
        return this.model.findOne({
            where: {
                [attribut]: value
            }
        });
    }
}