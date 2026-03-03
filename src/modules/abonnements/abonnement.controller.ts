import { Request, Response } from "express";
import { AbonnementService } from "./abonnement.service";
import { asyncHandler } from "../middleware/error.middleware";
import { NotFoundError } from "../../common/errors"; // Chemin à adapter

export class AbonnementController {
    private abonnementService: AbonnementService;

    constructor() {
        this.abonnementService = new AbonnementService();
    }

    /**
     * Récupérer les abonnements paginés
     */

    getAbonnementPaginated = asyncHandler(async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await this.abonnementService.getAbonnementPaginated(page, limit);
        return res.json(result);
    });


    /**
     * Récupérer un abonnement par ID
     */
    getAbonnementByid = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const abonnement = await this.abonnementService.getAbonnementById(id);

        if (!abonnement) {
            // Déclenche une erreur 404 gérée par le middleware global
            throw new NotFoundError("Abonnement", id);
        }

        return res.status(200).json(abonnement);
    });


    /**
     * Créer un abonnement
     */
    createAbonnement = asyncHandler(async (req: Request, res: Response) => {
        const created = await this.abonnementService.createAbonnement(req.body);
        return res.status(201).json(created);
        
    });

    /**
     * Supprimer un abonnement
     */
    deleteAbonnement = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const result = await this.abonnementService.deleteAbonnement(id);
        
        
        return res.json(result);
    });
}






















/*
    getAllAbonnements = async (req: Request, res: Response) => {
        try {
            const data = await this.abonnementService.getAllAbonnements();
            return res.json(data);
        } catch (error: any) {
            return res.status(500).json({ message: error.message || 'Erreur serveur' });
        }
    }
*/




/*
    updateAbonnement = async (req: Request, res: Response) => {
        try {
            const { id } = req.params as { id: string };
            const payload = req.body;
            const updated = await this.abonnementService.updateAbonnement(id, payload);
            return res.json(updated);
        } catch (error: any) {
            const status = /non trouvé/i.test(error.message) ? 404 : 400;
            return res.status(status).json({ message: error.message || 'Erreur lors de la mise à jour' });
        }
    }
*/








/*
    getAbonnementByLabel = async (req: Request, res: Response) => {
        try {
            const { label } = req.params as { label: string };  
            const abonnement = await this.abonnementService.getAbonnementByLabel(label);

            if (!abonnement) {
                return res.status(404).json({ message: "Abonnement non trouvé" });
            } } catch (error: any) {
            console.error("Erreur lecture abonnement par label :", error);
            return res.status(500).json({ message: error.message || "Erreur serveur" });
        }
    }
*/