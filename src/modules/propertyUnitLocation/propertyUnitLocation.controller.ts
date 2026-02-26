import { Request, Response } from "express";
import { CreatepropertyUnitLocationInput } from "./propertyUnitLocation.schema";
import { PropertyUnitLocationService } from "./propertyUnitLocation.service";
import { sendCreated, sendPaginated, sendSuccess } from "@/common/api.response";


export class PropertyUnitLocationController {

    private readonly propertyUnitLocationService: PropertyUnitLocationService;

    constructor() {
        this.propertyUnitLocationService = new PropertyUnitLocationService();
    }

    getAllpropertyUnitLocations = async (req: Request, res: Response): Promise<Response> => {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { data, total } = await this.propertyUnitLocationService.getAllpropertyUnitLocations(page, limit);

        return sendPaginated(
            res,
            data,
            total,
            page,
            limit
        );
    }

    getpropertyUnitLocation = async (req: Request, res: Response): Promise<Response> => {

        const id = req.params.id as string;
        const data = await this.propertyUnitLocationService.getpropertyUnitLocationById(id);
        return sendSuccess(
            res,
            data,
            "Operation successful",
            201
        );
    }

    updatepropertyUnitLocation = async (req: Request, res: Response): Promise<Response> => {

        const id = req.params.id as string;
        const dataToModify = req.body as CreatepropertyUnitLocationInput;

        const data = await this.propertyUnitLocationService.updatepropertyUnitLocation(id, dataToModify);

        return sendSuccess(
            res,
            data,
            "Operation successful",
            201
        );
    }

    createpropertyUnitLocation = async (req: Request, res: Response) => {
        const dataToCreate: CreatepropertyUnitLocationInput = req.body;
        const data = await this.propertyUnitLocationService.createPropertyUnitLocation(dataToCreate);
        return sendCreated(
            res,
            data,
            "Resource created successfully"
        );
    }

    deletepropertyUnitLocation = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const data = await this.propertyUnitLocationService.deletepropertyUnitLocation(id);
        return sendSuccess(
            res,
            data,
            "Operation successful"
        );
    }

}