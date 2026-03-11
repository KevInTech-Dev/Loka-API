import { Request, Response } from "express";
import { sendCreated, sendPaginated, sendSuccess } from "@/common/api.response";
import { CreateFactureEauInput } from "./facture.schema";
import { FactureEauService } from "./facture.service";

export class FactureEauController {
    private factureEauService: FactureEauService;
    constructor() {
        this.factureEauService = new FactureEauService();
    }

    createFactureEau = async (req: Request, res: Response): Promise<Response> => {
        const objectToSave = req.body as CreateFactureEauInput;
        const data = await this.factureEauService.createFactureEau(objectToSave);
        return sendCreated(
            res,
            data,
            "Object created succesfully"
        );
    }

    getFactureEauById = async (req: Request, res: Response) => {
        const idOfObject = req.params.id as string;
        const data = await this.factureEauService.getInvoiceEauById(idOfObject);
        return sendSuccess(
            res,
            data,
            "Operation succesfull",
            201
        );
    }

    getAllFactureEauPaginated = async (req: Request, res: Response): Promise<Response> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { data, total } = await this.factureEauService.getAllInvoiceEau(page, limit);

        return sendPaginated(
            res,
            data,
            limit,
            page,
            total
        );

    }

    updateFactureEau = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const dataToModify = req.body as CreateFactureEauInput;
        const data = await this.factureEauService.updateFactureEau(id, dataToModify);
        return sendSuccess(
            res,
            data,
            "Operation successfull",
            201
        );
    }

    deleteFactureEau = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const data = await this.factureEauService.deleteFactureEau(id);
        return sendSuccess(
            res,
            data,
            "Operation successful"
        );
    }
}