import {Request, Response} from "express";
import { AbonnementService } from "./abonnement.service";

export class AbonnementController {

    private abonnementService: AbonnementService;

    constructor() {
        this.abonnementService = new AbonnementService();
    }

    getAllAbonnements = async (req: Request, res: Response) => {
        try {
            const data = await this.abonnementService.getAllAbonnements();
            return res.json(data);
        } catch (error: any) {
            return res.status(500).json({ message: error.message || 'Erreur serveur' });
        }
    }

    getAbonnement = async (req: Request, res: Response) => {
        try {
            const { id } = req.params as { id: string };

            const abonnement = await this.abonnementService.getAbonnementById(id);

            if (!abonnement) {
                return res.status(404).json({ message: "Abonnement non trouvé" });
            }

            return res.status(200).json(abonnement);

        } catch (error: any) {
            console.error("Erreur lecture abonnement :", error);
            return res.status(500).json({ message: error.message || "Erreur serveur" });
        }
    }

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

    createAbonnement = async (req: Request, res: Response) => {
        try {
            const payload = req.body;
            const created = await this.abonnementService.createAbonnement(payload);
            return res.status(201).json(created);
        } catch (error: any) {
            const status = /existe déjà/i.test(error.message) ? 409 : 400;
            return res.status(status).json({ message: error.message || 'Erreur lors de la création' });
        }
    }

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

    deleteAbonnement = async (req: Request, res: Response) => {
        try {
            const { id } = req.params as { id: string };
            const result = await this.abonnementService.deleteAbonnement(id);
            return res.json(result);
        } catch (error: any) {
            const status = /non trouvé/i.test(error.message) ? 404 : 400;
            return res.status(status).json({ message: error.message || 'Erreur lors de la suppression' });
        }
    }

}
