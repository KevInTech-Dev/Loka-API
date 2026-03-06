import { BaseRepositoryImpl } from "@/common/base.repository";
import { AbonnementAttributes, Abonnements } from "@/database/models/Abonnements";
import { CreationAttributes } from "sequelize";
import { AbonnementResponse, WhereQueryAbonnements } from "./abonnement.types";


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
// private abonnementModel: ModelStatic<Abonnements>;

// constructor() {
//     this.abonnementModel = abonnements;
// }

// async createAbonnement(data: AbonnementCreationAttributes): Promise<abonnements> {

//     return await this.abonnementModel.create(data);
// }

// async getAbonnementById(id: string): Promise<abonnements | null> {
//     return await this.abonnementModel.findByPk(id);
// }

// async getAbonnementsPaginated(page: number, limit: number): Promise<{
//     data: abonnements[];
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
// }> {
//     const offset = (page - 1) * limit;

//     const { count, rows } = await this.abonnementModel.findAndCountAll({
//         offset,
//         limit,
//         order: [['createdAt', 'DESC']]
//     });

//     return {
//         data: rows,
//         total: count,
//         page,
//         limit,
//         totalPages: Math.ceil(count / limit)
//     };
// }

// async deleteAbonnement(id: string): Promise<boolean> {
//     const abonnement = await this.getAbonnementById(id);
//     if (!abonnement) return false;

//     await abonnement.destroy();
//     return true;
// }














/*
    async getAbonnementByLabel(label: string): Promise<abonnements | null> {
        return await this.abonnementModel.findOne({
            where: { label }
        });
    }
*/


/*
    async getAllAbonnements(): Promise<abonnements[]> {
        return await this.abonnementModel.findAll({
            order: [['createdAt', 'DESC']]
        });
    }
*/


/*
    async getAbonnementsByPriceRange(minPrix: number, maxPrix: number): Promise<abonnements[]> {
        return await this.abonnementModel.findAll({
            where: {
                prix: {
                    [Op.between]: [minPrix, maxPrix]
                }
            },
            order: [['prix', 'ASC']]
        });
    }

    async getMostExpensiveAbonnements(limit: number = 5): Promise<abonnements[]> {
        return await this.abonnementModel.findAll({
            order: [['prix', 'DESC']],
            limit
        });
    }
*/


/*
    async updateAbonnement(
        id: string, 
        data: Partial<AbonnementCreationAttributes>
    ): Promise<abonnements | null> {
        const abonnement = await this.getAbonnementById(id);
        if (!abonnement) return null;

        return await abonnement.update(data);
    }
*/


/*
    async countAbonnements(): Promise<number> {
        return await this.abonnementModel.count();
    }

    async exists(id: string): Promise<boolean> {
        const count = await this.abonnementModel.count({
            where: { id }
        });
        return count > 0;
    }

    */