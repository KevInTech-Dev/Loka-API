import { Utilisateur_Abonnement } from "@database/models/Utilisateur_Abonnement"; 
import { ModelStatic } from "sequelize";

export class Utilisateur_AbonnementRepository {
   
    private model: ModelStatic<Utilisateur_Abonnement>;

    constructor() {
        this.model = Utilisateur_Abonnement;
    }

    // Création d'une relation
    async create(data: any): Promise<Utilisateur_Abonnement> {
        try {
            return await this.model.create(data);
        } catch (error) {
            console.error('Erreur lors de la création:', error);
            throw new Error('Impossible de créer la relation');
        }
    }

    // Récupération par ID
    async getById(id: string): Promise<Utilisateur_Abonnement | null> {
        try {
            return await this.model.findByPk(id);
        } catch (error) {
            console.error('Erreur récupération ID:', error);
            throw new Error('Erreur base de données');
        }
    }

    // Récupérer tout
    async getAll(): Promise<Utilisateur_Abonnement[]> {
        try {
            return await this.model.findAll({
                order: [['createdAt', 'DESC']]
            });
        } catch (error) {
            throw new Error('Erreur lors de la récupération globale');
        }
    }
async getAbonnementsPaginated(page: number, limit: number): Promise<{
        data: Utilisateur_Abonnement[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        try {
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
        } catch (error) {
            console.error('Erreur lors de la récupération paginée:', error);
            throw new Error('Impossible de récupérer les abonnements paginés');
        }
    }
    // Mise à jour
    async update(id: string, data: any): Promise<Utilisateur_Abonnement | null> {
        try {
            const instance = await this.getById(id);
            if (!instance) return null;
            return await instance.update(data);
        } catch (error) {
            throw new Error('Échec de la mise à jour');
        }
    }
/*
    // Suppression
    async delete(id: string): Promise<boolean> {
        try {
            const deleted = await this.model.destroy({ where: { id } });
            return deleted > 0;
        } catch (error) {
            throw new Error('Échec de la suppression');
        }
    }

}


















/*import { abonnements, AbonnementCreationAttributes } from "@database/models/Abonnements";
import { ModelStatic, Op } from "sequelize";
import { DureeAbonnementEnum } from "@/enums/DureeAbonnementEnum";


export class Utilisateur_AbonnementRepository {
    private utilisateur_abonnementModel: ModelStatic<duree_abonnement>;

    constructor() {
        this.utilisateur_abonnementModel = DureeAbonnementEnum;
    }

   
    async createUtilisateur_Abonnement(data: Utilisateur_AbonnementRepository): Promise<Utilisateur_AbonnementRepository> {
        try {
            return await this.utilisateur_abonnementModel.create(data);
        } catch (error) {
            console.error('Erreur lors de la création de l\'abonnement:', error);
            throw new Error('Impossible de créer l\'abonnement');
        }
    }

   
    async getAbonnementById(id: string): Promise<abonnements | null> {
        try {
            return await this.utilisateur_abonnementModel.findByPk(id);
        } catch (error) {
            console.error('Erreur lors de la récupération de la relation utilisateur_abonnement', error);
            throw new Error('Impossible de récupérer la relation utilisateur_abonnement');
        }
    }

    
    
    async getAllUtilisateur_Abonnement(): Promise<Utilisateur_AbonnementRepository[]> {
        try {
            return await this.utilisateur_abonnementModel.findAll({
                order: [['createdAt', 'DESC']]
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des relations Utilisateur_Abonnement:', error);
            throw new Error('Impossible de récupérer la liste des relations Utilisateur_Abonnement');
        }
    }

    /*
    async getUtilisateur_AbonnementsPaginated(page: number, limit: number): Promise<{
        idata: abonnements[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        try {
            const offset = (page - 1) * limit;
            
            const { count, rows } = await this.abonnementModel.findAndCountAll({
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
        } catch (error) {
            console.error('Erreur lors de la récupération paginée:', error);
            throw new Error('Impossible de récupérer les abonnements paginés');
        }
    }

   */ 


   /* 
    async updateUtilisateur_Abonnement(
        id: string, 
        data: Partial<Utilisateur_AbonnementRepository>
    ): Promise<Utilisateur_AbonnementRepository | null> {
        try {
            const utilisateur_abonnement = await this.getAbonnementById(id);
            if (!utilisateur_abonnement) return null;

            await utilisateur_abonnement.update(data);
            return utilisateur_abonnement;
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            throw new Error('Impossible de mettre à jour la relation utilisateur_abonnement');
        }
    }

    
    async deleteUtilisateur_Abonnement(id: string): Promise<boolean> {
        try {
            const utilisateur_abonnement = await this.getAbonnementById(id);
            if (!utilisateur_abonnement) return false;

            await utilisateur_abonnement.destroy();
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            throw new Error('Impossible de supprimer la relation utilisateur_abonnement');
        }
    }

    // Compte le nombre total d'abonnements
     
    async countAbonnements(): Promise<number> {
        try {
            return await this.utilisateur_abonnementModel.count();
        } catch (error) {
            console.error('Erreur lors du comptage:', error);
            throw new Error('Impossible de compter les relations utilisateur_abonnement');
        }
    }

    // Vérifie si la relation  existe

    async exists(id: string): Promise<boolean> {
        const count = await this.utilisateur_abonnementModel.count({
            where: { id }
        });
        return count > 0;
    }

 */  
   
    }

