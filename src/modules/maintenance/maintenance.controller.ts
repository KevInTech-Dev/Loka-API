import { Request, Response } from "express";
import { MaintenanceService } from "./maintenance.service";
import { sendCreated, sendPaginated, sendSuccess } from "@/common/api.response";

export class MaintenanceController {
    private maintenanceService: MaintenanceService
    constructor() {
        this.maintenanceService = new MaintenanceService();
    }

    createMaintenance = async (req: Request, res: Response): Promise<Response> => {
        const dataSave = req.body;
        const data = await this.maintenanceService.createMaintenance(dataSave);
        return sendCreated(
            res,
            data,
            "Operation succesfull",
        );
    }


    updateMaintenance = async (req: Request, res: Response) => {
        const idObject = req.params.id as string;
        const update = await this.maintenanceService.updateMaintenance(idObject, req.body);
        return sendSuccess(
            res,
            update,
            "Operation of update successfull"
        );
    }

    addTechnicalManager = async (req: Request, res: Response) => {
        const idObject = req.params.id as string;
        const update = await this.maintenanceService.updateMaintenance(idObject, req.body);
        return sendSuccess(
            res,
            update,
            "Operation of update successfull"
        );
    }

    getMaintenanceById = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const objectToGet = await this.maintenanceService.getMaintenanceById(id);
        return sendSuccess(
            res,
            objectToGet,
            "Operation succesfull"
        );
    }

    getMaintenancePaginated = async (req: Request, res: Response): Promise<Response> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const { data, total } = await this.maintenanceService.getMaintenance(page, limit);
        return sendPaginated(
            res,
            data,
            page,
            limit,
            total,
        );
    }

    deleteMaintenance = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        const data = await this.maintenanceService.deleteMaintenace(id);
        return sendSuccess(
            res,
            data,
            "Operation succesfull"
        );
    }
}