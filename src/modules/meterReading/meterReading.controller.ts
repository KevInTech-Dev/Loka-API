import { CreationMeterReadingInput, UpdateMeterReadingInput } from "@modules/meterReading/meterReading.schemas";
import { MeterReadingService } from "@modules/meterReading/meterReading.service";
import { Request, Response } from "express";

export class MeterReadingController {
    private meterService: MeterReadingService;

    constructor(){
        this.meterService = new MeterReadingService();
    }

    createMeterReading = async(req: Request, res: Response) => {
        const data: CreationMeterReadingInput = req.body;
        return res.send({
            data: await this.meterService.createMeterReading({...data, recorded_by_user_id:req?.user?.id }),
        });
    }

    getMeterReading = async(req: Request, res: Response) => {
        const id = req.params.id as string;
        return res.send({
            data: await this.meterService.getMeterReadingyId(id),
        });
    };

    getPaginatedMeterReading = async(req: Request, res: Response) =>{
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        return res.send({
           page: req.query.page,
           limit: req.query.limit,
           data: await this.meterService.getPaginatedMeter(page, limit)
        });
    };

    updateMeterReading = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const data = req.body as Partial<UpdateMeterReadingInput>;
        return res.send({
            data: await this.meterService.updateMeterReading(id, data),
        })
    }

    deleteMeterReanding = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        return res.send({
            data: await this.meterService.deleteMeterReading(id),
        })
    }
}