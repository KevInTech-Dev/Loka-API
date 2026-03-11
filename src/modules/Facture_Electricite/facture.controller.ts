import { Request, Response } from "express";
import { sendCreated, sendPaginated, sendSuccess } from "@/common/api.response";
import { CreateFactureElectriciteInput } from "./facture.schema";
import { FactureElectriciteService } from "./facture.service";

export class FactureElectriciteController {
    private factureElectriciteService: FactureElectriciteService;
    constructor() {
        this.factureElectriciteService = new FactureElectriciteService();
    }

    createFactureElectricite = async (req: Request, res: Response): Promise<Response> => {
        const objectToSave = req.body as CreateFactureElectriciteInput;
        const data = await this.factureElectriciteService.createFactureElectricite(objectToSave);
        return sendCreated(
            res,
            data,
            "Object created succesfully"
        );
    }

    getFactureElectriciteById = async (req: Request, res: Response) => {
        const idOfObject = req.params.id as string;
        const data = await this.factureElectriciteService.getInvoiceElectriciteById(idOfObject);
        return sendSuccess(
            res,
            data,
            "Operation succesfull",
            201
        );
    }

    getAllFactureElectricitePaginated = async (req: Request, res: Response): Promise<Response> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { data, total } = await this.factureElectriciteService.getAllInvoiceElectricite(page, limit);

        return sendPaginated(
            res,
            data,
            limit,
            page,
            total
        );

    }

    updateFactureElectricite = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const dataToModify = req.body as CreateFactureElectriciteInput;
        const data = await this.factureElectriciteService.updateFactureElectricite(id, dataToModify);
        return sendSuccess(
            res,
            data,
            "Operation successfull",
            201
        );
    }

    deleteFactureElectricite = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const data = await this.factureElectriciteService.deleteFactureElectricite(id);
        return sendSuccess(
            res,
            data,
            "Operation successful"
        );
    }
}