import { Request, Response } from "express";
import { sendCreated, sendPaginated, sendSuccess } from "@/common/api.response";
import { CreateFactureAbonnementInput } from "./facture.schema";
import { FactureAbonnementService } from "./facture.service";

export class FactureAbonnementController {
    private factureAbonnementService: FactureAbonnementService;
    constructor() {
        this.factureAbonnementService = new FactureAbonnementService();
    }

    createFactureAbonnement = async (req: Request, res: Response): Promise<Response> => {
        const objectToSave = req.body as CreateFactureAbonnementInput;
        const data = await this.factureAbonnementService.createFactureAbonnement(objectToSave);
        return sendCreated(
            res,
            data,
            "Object created succesfully"
        );
    }

    getFactureAbonnementById = async (req: Request, res: Response) => {
        const idOfObject = req.params.id as string;
        const data = await this.factureAbonnementService.getInvoiceAbonnementById(idOfObject);
        return sendSuccess(
            res,
            data,
            "Operation succesfull",
            201
        );
    }

    getAllFactureAbonnementPaginated = async (req: Request, res: Response): Promise<Response> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { data, total } = await this.factureAbonnementService.getAllInvoiceAbonnement(page, limit);

        return sendPaginated(
            res,
            data,
            limit,
            page,
            total
        );

    }

    updateFactureAbonnement = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const dataToModify = req.body as CreateFactureAbonnementInput;
        const data = await this.factureAbonnementService.updateFactureAbonnement(id, dataToModify);
        return sendSuccess(
            res,
            data,
            "Operation successfull",
            201
        );
    }

    deleteFactureAbonnement = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const data = await this.factureAbonnementService.deleteFactureAbonnement(id);
        return sendSuccess(
            res,
            data,
            "Operation successful"
        );
    }
}