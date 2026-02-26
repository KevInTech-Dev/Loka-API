import { Request, Response } from "express";
import { PropertyTypeService } from "./propertyType.service";
import { CreatePropertyTypeInput } from "./propertyType.schema";
import { sendCreated, sendPaginated, sendSuccess } from "@/common/api.response";
export class PropertyTypeController {

    private readonly propertyTypeService: PropertyTypeService;

    constructor() {
        this.propertyTypeService = new PropertyTypeService;
    }

    getAllpropertyType = async (req: Request, res: Response): Promise<Response> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const { data, total } = await this.propertyTypeService.getAllPropertyTypes(page, limit);
        return sendPaginated(
            res,
            data,
            limit,
            page,
            total
        );
    }

    getpropertyType = async (req: Request, res: Response): Promise<Response> => {

        const id = req.params.id as string;
        const data = await this.propertyTypeService.getPropertyTypeById(id);

        return sendSuccess(
            res,
            data,
            "Operation successful",
            201
        );
    }

    updatepropertyType = async (req: Request, res: Response): Promise<Response> => {

        const id = req.params.id as string;
        const dataToModify = req.body as CreatePropertyTypeInput;
        const data = await this.propertyTypeService.updatePropertyType(id, dataToModify);
        return sendSuccess(
            res,
            data,
            "Operation successful",
            201
        );
    }

    createpropertyType = async (req: Request, res: Response): Promise<Response> => {
        const dataToCreate: CreatePropertyTypeInput = req.body;
        const data = await this.propertyTypeService.createPropertyType(dataToCreate);
        return sendCreated(
            res,
            data,
            "Resource created successfully"
        );
    }

    deletepropertyType = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        const data = await this.propertyTypeService.deletePropertyType(id);
        return sendSuccess(
            res,
            data,
            "Operation successful"
        );
    }
}