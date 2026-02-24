
import { Request, Response } from "express";
import { Utilisateur_AbonnementService } from "./utilisateur_abonnement.service";


export class Utilisateur_AbonnementController {
    // On instancie le service
    private service = new Utilisateur_AbonnementService();

    // 
    create = async (req: Request, res: Response) => {
        try {
            
            const result = await this.service.create(req.body); 
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    getAll = async (req: Request, res: Response) => {
        try {
            const result = await this.service.getAll();
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            
            const id = req.params.id.toString();
            const result = await this.service.getById(id);
            res.json(result);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };
/*
    update = async (req: Request, res: Response) => {
        try {
           
            const id = req.params.id.toString();
            const result = await this.service.update(id, req.body);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

}


    delete = async (req: Request, res: Response) => {
        try {
           
            const id = req.params.id.toString();
            await this.service.delete(id);
            res.json({ message: "Relation supprimée avec succès" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
*/
 }


