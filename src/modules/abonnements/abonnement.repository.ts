import { BaseRepositoryImpl } from "@/common/base.repository";
import { AbonnementAttributes, Abonnements } from "@/database/models/Abonnements";
import { CreationAttributes } from "sequelize";
import { WhereQueryAbonnements } from "./abonnement.types";

export class AbonnementRepository extends BaseRepositoryImpl<Abonnements> {

    constructor() {
        super(Abonnements);
    }

    create(data: CreationAttributes<Abonnements>): Promise<Abonnements> {
        return this.model.create(data);
    }

    async findById(id: string) {
        return this.model.findByPk(id);
    }


    async getAbonnementPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.model.findAndCountAll({ offset, limit });
    }

    getAbonnementByAttribut(attribut: keyof AbonnementAttributes, value: string) {
        return this.model.findOne({
            where: {
                [attribut]: value
            }
        });
    }


    getAbonnementByMutipleAttributs(attribut: WhereQueryAbonnements) {
        return this.model.findOne({
            where: {
                ...attribut
            }
        })
    }
}

