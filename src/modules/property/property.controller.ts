import { Request, Response } from "express";
import { PropertyService } from "./property.service";
import { CreatePropertyInput } from "./property.schema";

export class PropertyController {
    private readonly propertyService: PropertyService;

    constructor() {
        this.propertyService = new PropertyService();
    }

    getAllProperty = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        return res.send({
            page: req.query.page,
            limit: req.query.limit,
            data: await this.propertyService.getAllPropertys(page, limit)
        });
    }

    getProperty = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        return res.send({
            data: await this.propertyService.getPropertyById(id),
        });
    }

    updateProperty = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const data = req.body as CreatePropertyInput;
        return res.send({
            data: await this.propertyService.updateProperty(id, data),
        });
    }

    createProperty = async (req: Request, res: Response) => {
        const data: CreatePropertyInput = req.body;
        return res.send({
            data: await this.propertyService.createProperty(data),
        });
    }

    deleteProperty = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        return res.send({
            data: await this.propertyService.deleteProperty(id),
        });
    }
}