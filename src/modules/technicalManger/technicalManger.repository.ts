import { BaseRepositoryImpl } from "@/common/base.repository";
import { Attributes, CreationAttributes } from "sequelize";
import { WhereQueryTechnicalManager } from "./technicalManger.type";
import { TechnicalManager, TechnicalManagerAttributes } from "@/database/models/technicalManger";

export class TechnicalMangerRepository extends BaseRepositoryImpl<TechnicalManager> {

    constructor() {
        super(TechnicalManager)
    }

    async create(data: CreationAttributes<TechnicalManager>): Promise<TechnicalManager> {
        return this.model.create(data);
    }

    async findById(id: string) {
        return this.model.findByPk(id);
    }


    async getTechnicalManagerPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.model.findAndCountAll({ offset, limit });
    }

    getTechnicalManagerByAttribut(attribut: keyof TechnicalManagerAttributes, value: string) {
        return this.model.findOne({
            where: {
                [attribut]: value
            }
        });
    }


    getUserByMutipleAttributs(attribut: WhereQueryTechnicalManager) {
        return this.model.findOne({
            where: {
                ...attribut
            }
        })
    }

}