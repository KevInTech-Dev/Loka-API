import { Request, Response } from "express";
import { sendCreated, sendPaginated, sendSuccess } from "@/common/api.response";
import { CreateFactureLoyerInput } from "./facture.schema";
import { FactureLoyerService } from "./facture.service";

export class FactureLoyerController {
    private factureLoyerService: FactureLoyerService;
    constructor() {
        this.factureLoyerService = new FactureLoyerService();
    }

    createFactureLoyer = async (req: Request, res: Response): Promise<Response> => {
        const objectToSave = req.body as CreateFactureLoyerInput;
        const data = await this.factureLoyerService.createFactureLoyer(objectToSave);
        return sendCreated(
            res,
            data,
            "Object created succesfully"
        );
    }

    getFactureLoyerById = async (req: Request, res: Response) => {
        const idOfObject = req.params.id as string;
        const data = await this.factureLoyerService.getInvoiceLoyerById(idOfObject);
        return sendSuccess(
            res,
            data,
            "Operation succesfull",
            201
        );
    }

    getAllFactureLoyerPaginated = async (req: Request, res: Response): Promise<Response> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { data, total } = await this.factureLoyerService.getAllInvoiceLoyer(page, limit);

        return sendPaginated(
            res,
            data,
            limit,
            page,
            total
        );

    }

    updateFactureLoyer = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const dataToModify = req.body as CreateFactureLoyerInput;
        const data = await this.factureLoyerService.updateFactureLoyer(id, dataToModify);
        return sendSuccess(
            res,
            data,
            "Operation successfull",
            201
        );
    }

    deleteFactureLoyer = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const data = await this.factureLoyerService.deleteFactureLoyer(id);
        return sendSuccess(
            res,
            data,
            "Operation successful"
        );
    }
}