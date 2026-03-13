import { Request, Response } from "express";
import { TechnicalMangerService } from "./technicalManger.service";
import { sendCreated, sendPaginated, sendSuccess } from "@/common/api.response";
import { TechnicalManagerInput } from "./technicalManger.schema";

export class TechnicalManagerController {
    private technicalMangerService: TechnicalMangerService;
    constructor() {
        this.technicalMangerService = new TechnicalMangerService();
    }

    createTechnicalManager = async (req: Request, res: Response): Promise<Response> => {
        const technicalMangerData = req.body;
        const data = await this.technicalMangerService.createTechnicalManager(technicalMangerData);
        return sendCreated(
            res,
            data,
            "Operation succesfull"
        );
    }

    updateTechnicalManger = async (req: Request, res: Response): Promise<Response> => {
        //Recuperer l'id de technical manger
        const id = req.params.id as string;
        const dataInObjt = req.body as TechnicalManagerInput;

        const data = await this.technicalMangerService.updateTechnicalManger(id, dataInObjt);
        return sendSuccess(
            res,
            data,
            "Updated successfully",
            201
        );
    }

    getTechnicalMangerPaginated = async (req: Request, res: Response): Promise<Response> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const { data, total } = await this.technicalMangerService.getTechnicalMangerPaginated(page, limit)
        return sendPaginated(
            res,
            data,
            limit,
            page,
            total
        );

    }

    getTechnicalManagerById = async (req: Request, res: Response): Promise<Response> => {
        const idOfObject = req.params.id as string;
        const data = await this.technicalMangerService.getTechnicalManagerById(idOfObject);
        return sendSuccess(
            res,
            data,
            "Operation succesfull",
            201
        );
    }

    deleteTechnicalManger = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        const data = await this.technicalMangerService.deleteTechnicalManager(id);
        return sendSuccess(
            res,
            data,
            "Operation successful"
        );
    }
}