import { Request, Response } from "express"
import { UnitLocationService } from "./unitLocation.service";
import { CreateUnitLocationInput } from "./unitLocation.schema";


export class UnitLocationController {

    private readonly unitLocationService: UnitLocationService;

    constructor() {
        this.unitLocationService = new UnitLocationService();
    }

    getAllUnitLocations = async (req: Request, res: Response) => {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        return res.send({
            page: req.query.page,
            limit: req.query.limit,
            data: await this.unitLocationService.getUnitLocationPaginated(page, limit)
        });
    }

    getUnitLocation = async (req: Request, res: Response) => {

        const id = req.params.id as string;

        return res.send({
            data: await this.unitLocationService.getUnitLocationById(id),
        });
    }

    updateUnitLocation = async (req: Request, res: Response) => {

        const id = req.params.id as string;
        const data = req.body as CreateUnitLocationInput;

        return res.send({
            data: await this.unitLocationService.updateUnitLocation(id, data),
        });
    }

    createUnitLocation = async (req: Request, res: Response) => {
        const data: CreateUnitLocationInput = req.body;
        return res.send({
            data: await this.unitLocationService.createUnitLocation(data),
        });
    }

    deleteUnitLocation = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        return res.send({
            data: await this.unitLocationService.deleteUnitLocation(id),
        });
    }

}