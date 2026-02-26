import { CreateAbonnementInput, UpdateAbonnementInput } from "@modules/abonnements/abonnement.schema";
import { AbonnementRepository } from "@modules/abonnements/abonnement.repository";
import { PlanAbonnementEnum } from "@/enums/PlanAbonnementEnum";
//import { DuplicateEntryError, NotFoundError } from "@/common/errors";

export class AbonnementService {

    private abonnementRepository: AbonnementRepository;

    constructor() {
        this.abonnementRepository = new AbonnementRepository();
    }

    
    async createAbonnement(data: CreateAbonnementInput) {
        // Vérifier si un abonnement avec ce label existe déjà
        if (data.label) {
            const existingAbonnement = await this.abonnementRepository.getAbonnementById(data.label);
            if (existingAbonnement) {
                throw new Error('Un abonnement avec ce label existe déjà');
            }
        }

        // Créer l'abonnement
        const abonnement = await this.abonnementRepository.createAbonnement({
            planAbonnement: data.planAbonnement as PlanAbonnementEnum,
            nombreMaxProprietes: data.nombreMaxProprietes as number,
            nombreMaxUnitLocation: data.nombreMaxUnitLocation as number,
            //duree: data.duree,
            label: data.label || null,
            prix: data.prix,
            detail: data.detail,
             other: data.other as any,
        });

        return {
            id: abonnement.id,
            planAbonnement: abonnement.planAbonnement,
            //duree: abonnement.duree,
            nombreMaxPropriete: abonnement.nombreMaxProprietes,
            nombreMaxUnitLocation: abonnement.nombreMaxUnitLocation,
            label: abonnement.label,
            prix: abonnement.prix,
            detail: abonnement.detail,
            other: abonnement.other,
            createdAt: abonnement.createdAt,
            updatedAt: abonnement.updatedAt,
        };
    }

   
    async getAbonnementById(id: string) {
        const abonnement = await this.abonnementRepository.getAbonnementById(id);
        if (!abonnement) {
            return null;
        }
        return abonnement;
    }

    
    async getAbonnementPaginated(page: number, limit: number) {
        return this.abonnementRepository.getAbonnementsPaginated(page, limit);
    }

   

  
    async deleteAbonnement(id: string) {
        const deleted = await this.abonnementRepository.deleteAbonnement(id);
        if (!deleted) {
            throw new Error('Abonnement non trouvé');
        }
        return { 
            success: true, 
            message: 'Abonnement supprimé avec succès' 
        };
    }
}
   /*
    
    //Vérifie si un abonnement existe
    async abonnementExists(id: string): Promise<boolean> {
        const abonnement = await this.abonnementRepository.getAbonnementById(id);
        return !!abonnement;
    }

    //Récupère le nombre total d'abonnements
    async countAbonnements(): Promise<number> {
        const result = await this.abonnementRepository.getAbonnementsPaginated(1, 1);
        return result.total;
    }


     //Récupère les abonnements les plus chers
     
    async getMostExpensiveAbonnements(limit: number = 5) {
        
        const all = await this.abonnementRepository.getAllAbonnements();
        return all
            .sort((a, b) => b.prix - a.prix)
            .slice(0, limit);
    }
}*/



  /*
    async getAbonnementsByPriceRange(minPrix: number, maxPrix: number) {
        if (minPrix > maxPrix) {
            throw new Error('Le prix minimum ne peut pas être supérieur au prix maximum');
        }
        return this.abonnementRepository.getAbonnementsByPriceRange(minPrix, maxPrix);
    }

    
    async updateAbonnement(id: string, data: UpdateAbonnementInput) {
        // Vérifier si l'abonnement existe
        const existingAbonnement = await this.abonnementRepository.getAbonnementById(id);
        if (!existingAbonnement) {
            throw new Error('Abonnement non trouvé');
        }

        // Si on change le label, vérifier qu'il n'est pas déjà pris
        if (data.label && data.label !== existingAbonnement.label) {
            const abonnementWithSameLabel = await this.abonnementRepository.getAbonnementByLabel(data.label);
            if (abonnementWithSameLabel) {
                throw new Error('Un abonnement avec ce label existe déjà');
            }
        }

        // Mise à jour
         const updatedAbonnement = await this.abonnementRepository.updateAbonnement(id, data as any);
        return updatedAbonnement;
    }

    */