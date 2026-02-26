import { Request, Response } from "express"
import { UnitLocationService } from "./unitLocation.service";
import { CreateUnitLocationInput } from "./unitLocation.schema";
import { sendCreated, sendPaginated, sendSuccess } from "@/common/api.response";


export class UnitLocationController {

    private readonly unitLocationService: UnitLocationService;

    constructor() {
        this.unitLocationService = new UnitLocationService();
    }

    getAllUnitLocations = async (req: Request, res: Response): Promise<Response> => {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { data, total } = await this.unitLocationService.getAllUnitLocations(page, limit);

        return sendPaginated(
            res,
            data,
            limit,
            page,
            total
        );
    }

    getUnitLocation = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        const data = await this.unitLocationService.getUnitLocationById(id);
        return sendSuccess(
            res,
            data,
            "Operation successful",
            201
        );
    }

    updateUnitLocation = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        const dataToUpdate = req.body as CreateUnitLocationInput;
        const data = await this.unitLocationService.updateUnitLocation(id, dataToUpdate);
        return sendSuccess(
            res,
            data,
            "Operation successful",
            201
        );
    }

    createUnitLocation = async (req: Request, res: Response): Promise<Response> => {
        const dataToCreate: CreateUnitLocationInput = req.body;
        const data = await this.unitLocationService.createUnitLocation(dataToCreate);
        return sendCreated(
            res,
            data,
            "Resource created successfully"
        );
    }

    deleteUnitLocation = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const data = await this.unitLocationService.deleteUnitLocation(id);
        return sendSuccess(
            res,
            data,
            "Operation successful"
        );
    }

}