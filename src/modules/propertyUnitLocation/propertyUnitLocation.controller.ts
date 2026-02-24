import { Request, Response } from "express";
import { CreatepropertyUnitLocationInput } from "./propertyUnitLocation.schema";
import { PropertyUnitLocationService } from "./propertyUnitLocation.service";


export class PropertyUnitLocationController {

    private readonly propertyUnitLocationService: PropertyUnitLocationService;

    constructor() {
        this.propertyUnitLocationService = new PropertyUnitLocationService();
    }

    getAllpropertyUnitLocations = async (req: Request, res: Response) => {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        return res.send({
            page: req.query.page,
            limit: req.query.limit,
            data: await this.propertyUnitLocationService.getpropertyUnitLocationPaginated(page, limit)
        });
    }

    getpropertyUnitLocation = async (req: Request, res: Response) => {

        const id = req.params.id as string;

        return res.send({
            data: await this.propertyUnitLocationService.getpropertyUnitLocationById(id),
        });
    }

    updatepropertyUnitLocation = async (req: Request, res: Response) => {

        const id = req.params.id as string;
        const data = req.body as CreatepropertyUnitLocationInput;

        return res.send({
            data: await this.propertyUnitLocationService.updatepropertyUnitLocation(id, data),
        });
    }

    createpropertyUnitLocation = async (req: Request, res: Response) => {
        const data: CreatepropertyUnitLocationInput = req.body;
        return res.send({
            data: await this.propertyUnitLocationService.createPropertyUnitLocation(data),
        });
    }

    deletepropertyUnitLocation = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        return res.send({
            data: await this.propertyUnitLocationService.deletepropertyUnitLocation(id),
        });
    }

}