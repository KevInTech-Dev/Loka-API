import { Request, Response } from "express";
import { PropertyService } from "./property.service";
import { CreatePropertyInput } from "./property.schema";
import { sendCreated, sendPaginated, sendSuccess } from "@/common/api.response";

export class PropertyController {
    private readonly propertyService: PropertyService;

    constructor() {
        this.propertyService = new PropertyService();
    }

    getAllProperty = async (req: Request, res: Response): Promise<Response> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const { data, total } = await this.propertyService.getAllPropertys(page, limit);
        return sendPaginated(
            res,
            data,
            page,
            limit,
            total
        );
    }

    getProperty = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        const data = await this.propertyService.getPropertyById(id);
        return sendSuccess(
            res,
            data,
            "Operation successful",
            201
        );
    }

    updateProperty = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        const dataToModify = req.body as CreatePropertyInput;
        const data = await this.propertyService.updateProperty(id, dataToModify);
        return sendSuccess(
            res,
            data,
            "Operation successful",
            201
        );
    }


    addDocuments = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const data = await this.propertyService.addDocuments(id, file);
        return sendSuccess(
            res,
            data,
            "Operation successful",
            201
        );
    };

    createProperty = async (req: Request, res: Response): Promise<Response> => {
        const dataToCreate: CreatePropertyInput = req.body;
        const data = await this.propertyService.createProperty(dataToCreate);
        return sendCreated(
            res,
            data,
            "Resource created successfully"
        );
    }

    deleteProperty = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        const data = await this.propertyService.deleteProperty(id);
        return sendSuccess(
            res,
            data,
            "Operation successful"
        );
    }
}