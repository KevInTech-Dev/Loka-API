import { CreateTenantInput } from "./tenant.schema";
import { TenantService } from "./tenant.service";
import { Request, Response } from "express";
import {BadRequestError} from "@common/errors";

export class TenantController {
    private readonly tenantService: TenantService;

    constructor() {
        this.tenantService = new TenantService();
    }

    getAllTenants = async (req: Request, res: Response) => {
       const page = parseInt(req.query.page as string) || 1;
       const limit = parseInt(req.query.limit as string) || 10;

       return res.send({
        page: req.query.page,
        limit: req.query.limit,
        data: await this.tenantService.getTenantPaginated(page, limit)
       });
    }

    getTenant = async(req: Request, res: Response) => {
        const id= req.params.id as string;
        return res.send({
            data : await this.tenantService.getTenantById(id),
        });
    }

    updateTenant = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const data = req.body as Partial<CreateTenantInput>;
        return res.send({
            data: await this.tenantService.updateTenant(id, data),
        })
    }

    addCardPhoto = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const file = req.file;
        const {type} = req.body;

        if(!file){
            throw  new BadRequestError("File is required");
        }

        if (type !== 'front' && type !== 'back') {
            throw new BadRequestError("Type must be 'front' or 'back'");
        }

        const data = await this.tenantService.addCardPhoto(id, file, type);

        return res.send({
            message: `Photo ${type} uploaded successfully`,
            data,
        });
    };
    createTenant = async (req: Request, res: Response) => {
        const data: CreateTenantInput = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        console.log(files);
        return res.send({
            data: await this.tenantService.createTenant({
                ...data,
                id_card_back_url: files?.id_card_back_url ? files.id_card_back_url[0].path : undefined,
                id_card_front_url: files?.id_card_front_url ? files.id_card_front_url[0].path : undefined,
                photo: files?.photo ? files.photo[0].path : undefined,
            }),
        });
    }

    deleteTenant = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    return res.send({
      data: await this.tenantService.deleteTenant(id),
    });
  }
}