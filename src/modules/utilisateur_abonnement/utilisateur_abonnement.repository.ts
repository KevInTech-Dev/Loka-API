import { Utilisateur_Abonnement, UtilisateurAbonnementAttributes, UtilisateurAbonnementCreationAttributes } from "@database/models/Utilisateur_Abonnement";
import { ModelStatic, Transaction } from "sequelize";
import { BadRequestError } from "@/common/errors";
import { BaseRepositoryImpl } from "@/common/base.repository";
import { CreateUtilisateurAbonnementInput } from "./utilisateur_abonnement.schema";
import { StatusAbonnementEnum } from "@/enums/StatusAbonnement";

export class Utilisateur_AbonnementRepository extends BaseRepositoryImpl<Utilisateur_Abonnement> {

    constructor() {
        super(Utilisateur_Abonnement)
    }

    /**
     * Création d'une relation utilisateur-abonnement
     */
    async create(data: UtilisateurAbonnementAttributes, transaction?: Transaction): Promise<Utilisateur_Abonnement> {
        return await this.model.create(data, { transaction });
    }

    //Update de utilisateur abonnement
    async updateUtilisateurAbonnement(id: string, dataToUpdate: UtilisateurAbonnementCreationAttributes, transaction?: Transaction) {
        return await this.model.update(
            {
                ...dataToUpdate,
                status: dataToUpdate.status,
                startDate: new Date(dataToUpdate.startDate),
                endDate: new Date(dataToUpdate.startDate),
            },
            {
                where: {
                    id
                },
                transaction
            },

        );
    }

    /**
     * Récupération par ID
     */
    async getById(id: string): Promise<Utilisateur_Abonnement | null> {

        return await this.model.findByPk(id);
    }

    /**
     * Récupération paginée
     */
    async getAbonnementsPaginated(page: number, limit: number): Promise<{
        data: Utilisateur_Abonnement[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {

        const offset = (page - 1) * limit;


        const { count, rows } = await this.model.findAndCountAll({
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        });

        return {
            data: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        };
    }




    /**
     * Récupérer les abonnements d'un utilisateur spécifique
     */

    async getAbonnemmentByUtilisateurPaginated(utilisateurId: string, page: number, limit: number): Promise<{
        data: Utilisateur_Abonnement[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        try {
            const Page = Math.max(1, page || 1);
            const Limit = Math.min(100, Math.max(1, limit || 10));
            const offset = (Page - 1) * Limit;

            const { count, rows } = await this.model.findAndCountAll({
                where: { utilisateurId },
                offset,
                limit: Limit,
                order: [['createdAt', 'DESC']],
            });

            return {
                data: rows,
                total: count,
                page: Page,
                limit: Limit,
                totalPages: Math.ceil(count / Limit),
            };
        } catch (error) {
            console.error('Erreur lors de la récupération par utilisateur:', error);
            throw new Error('Impossible de récupérer les abonnements de l\'utilisateur');
        }

    }


    async checkIfUserHasAlreadySubBasic(id: string, idAbonnement: string): Promise<UtilisateurAbonnementAttributes> {
        return this.model.findOne({
            where: {
                utilisateurId: id,
                abonnementId: idAbonnement
            }
        })
    }




    async getUserAbonnementByUserId(userId: string) {
        return this.model.findOne({
            where: {
                utilisateurId: userId,
                endDate: {
                    [this.Op.lt]: new Date(Date.now())
                }
            }
        })
    }


}