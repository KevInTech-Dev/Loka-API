import { Utilisateur_AbonnementRepository } from "./utilisateur_abonnement.repository";
import { Utilisateur_Abonnement } from "@database/models/Utilisateur_Abonnement";
import { UtilisateurAbonnementAttributes } from "@database/models/Utilisateur_Abonnement";

export class Utilisateur_AbonnementService {
    private repository: Utilisateur_AbonnementRepository;
    

    constructor() {
        this.repository = new Utilisateur_AbonnementRepository();
    }

    /**
     * Crée une nouvelle relation utilisateur-abonnement
     */
    async create(data: UtilisateurAbonnementAttributes): Promise<Utilisateur_Abonnement> {
        try {
            return await this.repository.create(data);
        } catch (error) {
            console.error(' Erreur dans create service:', error);
            throw new Error('Impossible de créer la relation utilisateur-abonnement');
        }
    }

    /**
     * Récupère une relation par son ID
     */
    async getById(id: string): Promise<Utilisateur_Abonnement> {
        try {
            const relation = await this.repository.getById(id);
            
            if (!relation) {
                throw new Error(`Relation Utilisateur_Abonnement avec l'ID '${id}' non trouvée`);
            }
            
            return relation;
        } catch (error) {
            console.error(` Erreur dans getById pour l'ID ${id}:`, error);
            throw error; 
        }
    }

    /**
     * Récupère les relations avec pagination
     */
    async getAbonnementPaginated(page: number, limit: number): Promise<{
        data: Utilisateur_Abonnement[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        try {
    
            const validPage = Math.max(1, page);
            const validLimit = Math.min(100, Math.max(1, limit));
            
           
            return await this.repository.getAbonnementsPaginated(validPage, validLimit);
        } catch (error) {
            console.error(' Erreur dans getAbonnementPaginated:', error);
            throw new Error('Impossible de récupérer les relations paginées');
        }
    }

  
async getAbonnemmentByUtilisateurPaginated(
    utilisateurId: string, 
    page: number, 
    limit: number
): Promise<{
    data: Utilisateur_Abonnement[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}> {
    try {
        return await this.repository.getAbonnemmentByUtilisateurPaginated(utilisateurId, page, limit);
    } catch (error) {
        console.error(` Erreur dans getAbonnemmentByUtilisateurPaginated pour l'ID utilisateur ${utilisateurId}:`, error);
        throw new Error('Impossible de récupérer les abonnements paginés de l\'utilisateur');
    }   
}

}

/*
     Vérifie si une relation existe
     
    async exists(id: string): Promise<boolean> {
        try {
            return await this.repository.exists(id);
        } catch (error) {
            console.error(` Erreur dans exists pour l'ID ${id}:`, error);
            throw new Error('Impossible de vérifier l\'existence de la relation');
        }
    }
    */