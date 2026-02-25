import { Request, Response } from "express";
import { UnitTypeService } from "./unitType.service";
import { CreateUnitTypeInput } from "./unitType.schema";
import { sendCreated, sendPaginated, sendSuccess } from "@/common/api.response";

export class UnitTypeController {

    private readonly unitTypeService: UnitTypeService;

    constructor() {
        this.unitTypeService = new UnitTypeService();
    }

    getAllUnitTypes = async (req: Request, res: Response): Promise<Response> => {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { data, total } = await this.unitTypeService.getAllUnitTypes(page, limit);
        return sendPaginated(
            res,
            data,
            total,
            page,
            limit
        );
    }

    getUnitType = async (req: Request, res: Response): Promise<Response> => {

        const id = req.params.id as string;
        const data = await this.unitTypeService.getUnitTypeById(id);

        return sendSuccess(
            res,
            data,
            "Operation successful",
            201
        );
    }

    updateUnitType = async (req: Request, res: Response): Promise<Response> => {

        const id = req.params.id as string;
        const dataToModify = req.body as CreateUnitTypeInput;
        const data = await this.unitTypeService.updateUnitType(id, dataToModify);
        return sendSuccess(
            res,
            data,
            "Operation successful",
            201
        );
    }

    createUnitType = async (req: Request, res: Response): Promise<Response> => {
        const dataToCreate: CreateUnitTypeInput = req.body;
        const data = await this.unitTypeService.createUnitType(dataToCreate);
        return sendCreated(
            res,
            data,
            "Resource created successfully"
        );
    }

    // deleteUnitType = async (req: Request, res: Response) => {
    //     const id = req.params.id as string;
    //     return 
    // }

}