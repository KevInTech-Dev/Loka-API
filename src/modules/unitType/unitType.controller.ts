import { Request, Response } from "express";
import { UnitTypeService } from "./unitType.service";
import { CreateUnitTypeInput } from "./unitType.schema";

export class UnitTypeController {

    private readonly unitTypeService: UnitTypeService;

    constructor() {
        this.unitTypeService = new UnitTypeService();
    }

    getAllUnitTypes = async (req: Request, res: Response) => {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        return res.send({
            page: req.query.page,
            limit: req.query.limit,
            data: await this.unitTypeService.getUnitTypePaginated(page, limit)
        });
    }

    getUnitType = async (req: Request, res: Response) => {

        const id = req.params.id as string;

        return res.send({
            data: await this.unitTypeService.getUnitTypeById(id),
        });
    }

    updateUnitType = async (req: Request, res: Response) => {

        const id = req.params.id as string;
        const data = req.body as CreateUnitTypeInput;

        return res.send({
            data: await this.unitTypeService.updateUnitType(id, data),
        });
    }

    createUnitType = async (req: Request, res: Response) => {
        const data: CreateUnitTypeInput = req.body;
        return res.send({
            data: await this.unitTypeService.createUnitType(data),
        });
    }

    deleteUnitType = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        return res.send({
            data: await this.unitTypeService.deleteUnitType(id),
        });
    }

}