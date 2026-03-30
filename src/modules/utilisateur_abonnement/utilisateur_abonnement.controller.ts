
import { Request, Response } from "express";
import { Utilisateur_AbonnementService } from "./utilisateur_abonnement.service";
import { asyncHandler } from "../middleware/error.middleware";
import { NotFoundError } from "../../common/errors";
import { sendCreated } from "@/common/api.response";


export class Utilisateur_AbonnementController {
    // On instancie le service
    private service = new Utilisateur_AbonnementService();
    private utilisateur_abonnementService = new Utilisateur_AbonnementService();


    create = async (req: Request, res: Response) => {

        const result = await this.service.create(req.body);
        return sendCreated(
            res,
            result,
            "Operation of creation succesffull"
        );

    };


    


    //Pagination a faire plus tard, ne plus uiliser getAll 

    getAbonnementPaginated = asyncHandler(async (req: Request, res: Response) => {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await this.utilisateur_abonnementService.getAbonnementPaginated(page, limit);

        // Si tout va bien, on renvoie les données
        return res.json(result);


    });



    getById = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id.toString();
        const result = await this.service.getById(id);

        // Si le résultat est vide, on lance manuellement l'erreur 404
        if (!result) {
            throw new NotFoundError("Abonnement", id);
        }

        return res.json(result);


    });


    getAbonnementByUtilisateurPaginated = asyncHandler(async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const utilisateurId = req.params.id.toString();
        const result = await this.utilisateur_abonnementService.getAbonnemmentByUtilisateurPaginated(utilisateurId, page, limit);
        //const result = await this.abonnementService.getAbonnementPaginated(page, limit);

        return res.json(result);
    });















    /*
       getAll = async (req: Request, res: Response) => {
           try {
               const result = await this.service.getAll();
               res.json(result);
           } catch (error: any) {
               res.status(500).json({ message: error.message });
           }
       };
   */

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
    
    */
    /*
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