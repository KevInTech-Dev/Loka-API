import { Utilisateur_Abonnement, UtilisateurAbonnementAttributes } from "@database/models/Utilisateur_Abonnement";
import { ModelStatic } from "sequelize";
import { BadRequestError } from "@/common/errors";
import { BaseRepositoryImpl } from "@/common/base.repository";

export class Utilisateur_AbonnementRepository extends BaseRepositoryImpl<Utilisateur_Abonnement> {

    constructor() {
        super(Utilisateur_Abonnement)
    }

    /**
     * Création d'une relation utilisateur-abonnement
     */
    async create(data: UtilisateurAbonnementAttributes): Promise<Utilisateur_Abonnement> {

        return await this.model.create(data);
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





    async getUserAbonnementByUserId(userId: string) {
        return this.model.findOne({
            where: {
                utilisateurId: userId,
                // endDate: {
                //     [this.Op.lt]: new Date(Date.now())
                // }
            }
        })
    }


 /*
     * Suppression d'une relation
     
    async delete(id: string): Promise<boolean> {
        try {
            const instance = await this.getById(id);
            if (!instance) return false;

            await instance.destroy();
            return true;
        } catch (error) {
            console.error(' Erreur lors de la suppression:', error);
            throw new Error('Impossible de supprimer la relation');
        }
    }

*/

 /**
     * Récupérer toutes les relations
     
    async getAll(): Promise<Utilisateur_Abonnement[]> {
        try {
            return await this.model.findAll({
                order: [['createdAt', 'DESC']]
            });
        } catch (error) {
            console.error(' Erreur lors de la récupération globale:', error);
            throw new Error('Impossible de récupérer la liste des relations');
        }
    }
*/






 /**
     * Compter le nombre total de relations
     
    async count(): Promise<number> {
        try {
            return await this.model.count();
        } catch (error) {
            console.error(' Erreur lors du comptage:', error);
            throw new Error('Impossible de compter les relations');
        }
    }
*/



 /**
     * Vérifier si un utilisateur a déjà un abonnement actif
     
    async hasActiveSubscription(userId: string): Promise<boolean> {
        try {
            const count = await this.model.count({
                where: { 
                    userId,
                    statut: 'ACTIF'
                }
            });
            return count > 0;
        } catch (error) {
            console.error(' Erreur lors de la vérification d\'abonnement actif:', error);
            throw new Error('Impossible de vérifier l\'existence d\'un abonnement actif');
        }
    }
*/






 /**
     * Récupérer un abonnement actif d'un utilisateur
     
    async getActiveByUtilisateurId(utilisateurId: string): Promise<Utilisateur_Abonnement | null> {
        try {
            return await this.model.findOne({
                where: { 
                    utilisateurId,
                    statut: 'ACTIF'
                },
                order: [['createdAt', 'DESC']]
            });
        } catch (error) {
            console.error(' Erreur lors de la récupération de l\'abonnement actif:', error);
            throw new Error('Impossible de récupérer l\'abonnement actif');
        }
    }
*/





/**
     * Mise à jour d'une relation
     * Utilisation de Partial<UtilisateurAbonnementCreationAttributes>
     
    async update(
        id: string, 
        data: Partial<UtilisateurAbonnementAttributes>
    ): Promise<Utilisateur_Abonnement | null> {
        try {
            const instance = await this.getById(id);
            if (!instance) return null;
            
            return await instance.update(data);
        } catch (error) {
            console.error(' Erreur lors de la mise à jour:', error);
            throw new Error('Impossible de mettre à jour la relation');
        }
    }
*/




 /*
     * Vérifier si une relation existe
     
    async exists(id: string): Promise<boolean> {
        try {
            const count = await this.model.count({
                where: { id }
            });
            return count > 0;
        } catch (error) {
            console.error(' Erreur lors de la vérification d\'existence:', error);
            throw new Error('Impossible de vérifier l\'existence de la relation');
        }
    }
*/ }