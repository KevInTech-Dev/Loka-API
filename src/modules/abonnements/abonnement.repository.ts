import { abonnements, AbonnementCreationAttributes } from "@database/models/Abonnements";
import { ModelStatic, Op } from "sequelize";
import { PlanAbonnementEnum } from "@/enums/PlanAbonnementEnum";


export class AbonnementRepository {
    private abonnementModel: ModelStatic<abonnements>;

    constructor() {
        this.abonnementModel = abonnements;
    }

   
    async createAbonnement(data: AbonnementCreationAttributes): Promise<abonnements> {
        try {
            return await this.abonnementModel.create(data);
        } catch (error) {
            console.error('Erreur lors de la création de l\'abonnement:', error);
            throw new Error('Impossible de créer l\'abonnement');
        }
    }

   
    async getAbonnementById(id: string): Promise<abonnements | null> {
        try {
            return await this.abonnementModel.findByPk(id);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'abonnement:', error);
            throw new Error('Impossible de récupérer l\'abonnement');
        }
    }

    
    async getAbonnementByLabel(label: string): Promise<abonnements | null> {
        try {
            return await this.abonnementModel.findOne({
                where: { label }
            });
        } catch (error) {
            console.error('Erreur lors de la recherche par label:', error);
            throw new Error('Impossible de rechercher l\'abonnement par label');
        }
    }

    
    async getAllAbonnements(): Promise<abonnements[]> {
        try {
            return await this.abonnementModel.findAll({
                order: [['createdAt', 'DESC']]
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des abonnements:', error);
            throw new Error('Impossible de récupérer la liste des abonnements');
        }
    }

    
    async getAbonnementsPaginated(page: number, limit: number): Promise<{
        data: abonnements[];
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

    
   

    
    async getAbonnementsByPriceRange(minPrix: number, maxPrix: number): Promise<abonnements[]> {
        try {
            return await this.abonnementModel.findAll({
                where: {
                    prix: {
                        [Op.between]: [minPrix, maxPrix]
                    }
                },
                order: [['prix', 'ASC']]
            });
        } catch (error) {
            console.error('Erreur lors de la récupération par prix:', error);
            throw new Error('Impossible de récupérer les abonnements par fourchette de prix');
        }
    }

   
    async getMostExpensiveAbonnements(limit: number = 5): Promise<abonnements[]> {
        try {
            return await this.abonnementModel.findAll({
                order: [['prix', 'DESC']],
                limit
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des abonnements les plus chers:', error);
            throw new Error('Impossible de récupérer les abonnements les plus chers');
        }
    }

    
    async updateAbonnement(
        id: string, 
        data: Partial<AbonnementCreationAttributes>
    ): Promise<abonnements | null> {
        try {
            const abonnement = await this.getAbonnementById(id);
            if (!abonnement) return null;

            await abonnement.update(data);
            return abonnement;
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            throw new Error('Impossible de mettre à jour l\'abonnement');
        }
    }

    
    async deleteAbonnement(id: string): Promise<boolean> {
        try {
            const abonnement = await this.getAbonnementById(id);
            if (!abonnement) return false;

            await abonnement.destroy();
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            throw new Error('Impossible de supprimer l\'abonnement');
        }
    }

    // Compte le nombre total d'abonnements
     
    async countAbonnements(): Promise<number> {
        try {
            return await this.abonnementModel.count();
        } catch (error) {
            console.error('Erreur lors du comptage:', error);
            throw new Error('Impossible de compter les abonnements');
        }
    }

    // Vérifie si un abonnement existe

    async exists(id: string): Promise<boolean> {
        const count = await this.abonnementModel.count({
            where: { id }
        });
        return count > 0;
    }

   
   
    }
