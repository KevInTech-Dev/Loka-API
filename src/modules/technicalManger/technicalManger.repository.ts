import { BaseRepositoryImpl } from "@/common/base.repository";
import { Attributes, CreationAttributes } from "sequelize";
import { WhereQueryTechnicalManager } from "./technicalManger.type";
import { TechnicalManager, TechnicalManagerAttributes } from "@/database/models/technicalManger";
import { defaultPaginationQueryType } from "@/common/api.schema";

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

    async getAllwhereName(nameOfTechnicalManager: string) {
        return this.model.findAll({
            where: {
                name: nameOfTechnicalManager,
            }
        })
    }


    async getTechnicalManagerPaginated({ page, limit, sortBy, sortOrder, search }: defaultPaginationQueryType) {
        const offset = (page - 1) * limit;
        return this.model.findAndCountAll({
            offset, limit, where: {
                name: { [this.Op.like]: `%${search}` }
            },
            order: [[sortBy, sortOrder]]
        });
    }

    getTechnicalManagerByAttribut(attribut: keyof TechnicalManagerAttributes, value: string) {
        return this.model.findOne({
            where: {
                [attribut]: value
            }
        });
    }


    getTechnicalManagerByMutipleAttributs(attribut: WhereQueryTechnicalManager) {
        return this.model.findOne({
            where: {
                ...attribut
            }
        })
    }

}