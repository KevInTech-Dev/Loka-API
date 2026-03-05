import { Request, Response } from "express"
import { landLordService } from "@modules/landLord/landlord.service"
import { CreateLandlordInput } from "@modules/landLord/landlord.schema";

export class LandLordController {

    private readonly landlordService: landLordService;
    
    constructor(){
        this.landlordService = new landLordService();
    }

    getAllLandlords = async (req: Request, res: Response) => {
       const page = parseInt(req.query.page as string) || 1;
       const limit = parseInt(req.query.limit as string) || 10;

       return res.send({
        page: req.query.page,
        limit: req.query.limit,
        data: await this.landlordService.getlandLordPaginated(page, limit)
       });

    }

    getlandLord = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        return res.send({
            data: await this.landlordService.getlandLordById(id),
        });
    }

    updatelandLord = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const data = req.body as Partial<CreateLandlordInput>;
        return res.send({
            data: await this.landlordService.updatelandLord(id, data),
        })
    }
    
    addLandlordInfo = async (req: Request, res: Response) => {
        const data: CreateLandlordInput = req.body;
        return res.send({
            data: await this.landlordService.addLandlordInfo(data),
        });
    }

    deletelandLord = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    return res.send({
      data: await this.landlordService.deletelandLord(id),
    });
  }
}