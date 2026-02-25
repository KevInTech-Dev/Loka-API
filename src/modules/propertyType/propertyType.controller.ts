import { Request, Response } from "express";
import { PropertyTypeService } from "./propertyType.service";
import { CreatePropertyTypeInput } from "./propertyType.schema";
export class PropertyTypeController {

    private readonly propertyTypeService: PropertyTypeService;

    constructor() {
        this.propertyTypeService = new PropertyTypeService;
    }

    getAllpropertyType = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        return res.send({
            page: req.query.page,
            limit: req.query.limit,
            data: await this.propertyTypeService.getAllPropertyTypes(page, limit)
        });
    }

    getpropertyType = async (req: Request, res: Response) => {

        const id = req.params.id as string;

        return res.send({
            data: await this.propertyTypeService.getPropertyTypeById(id),
        });
    }

    updatepropertyType = async (req: Request, res: Response) => {

        const id = req.params.id as string;
        const data = req.body as CreatePropertyTypeInput;

        return res.send({
            data: await this.propertyTypeService.updatePropertyType(id, data),
        });
    }

    createpropertyType = async (req: Request, res: Response) => {
        const data: CreatePropertyTypeInput = req.body;
        return res.send({
            data: await this.propertyTypeService.createPropertyType(data),
        });
    }

    deletepropertyType = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        return res.send({
            data: await this.propertyTypeService.deletePropertyType(id),
        });
    }
}