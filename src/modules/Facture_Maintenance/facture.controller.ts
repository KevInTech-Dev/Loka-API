import { Request, Response } from "express";
import { FactureMaintenanceService } from "./facture.service";
import { CreateFactureMaintenanceInput } from "./facture.schema";
import { sendCreated, sendPaginated, sendSuccess } from "@/common/api.response";

export class FactureMaintenanceController {
    private factureMaintenanceService: FactureMaintenanceService;
    constructor() {
        this.factureMaintenanceService = new FactureMaintenanceService();
    }

    createFactureMaintenance = async (req: Request, res: Response): Promise<Response> => {
        const objectToSave = req.body as CreateFactureMaintenanceInput;
        const data = await this.factureMaintenanceService.createFactureMaintenance(objectToSave);
        return sendCreated(
            res,
            data,
            "Object created succesfully"
        );
    }

    getFactureMaintenanceById = async (req: Request, res: Response) => {
        const idOfObject = req.params.id as string;
        const data = await this.factureMaintenanceService.getInvoiceMaintenanceById(idOfObject);
        return sendSuccess(
            res,
            data,
            "Operation succesfull",
            201
        );
    }

    getAllFactureMaintenancePaginated = async (req: Request, res: Response): Promise<Response> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { data, total } = await this.factureMaintenanceService.getAllInvoiceMaintenance(page, limit);

        return sendPaginated(
            res,
            data,
            limit,
            page,
            total
        );

    }

    updateFactureMaintenance = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const dataToModify = req.body as CreateFactureMaintenanceInput;
        const data = await this.factureMaintenanceService.updateFactureMaintenance(id, dataToModify);
        return sendSuccess(
            res,
            data,
            "Operation successfull",
            201
        );
    }

    deleteFactureMaintenance = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const data = await this.factureMaintenanceService.deleteFactureMaintenance(id);
        return sendSuccess(
            res,
            data,
            "Operation successful"
        );
    }
}