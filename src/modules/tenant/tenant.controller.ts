import { CreateTenantInput } from "./tenant.schema";
import { TenantService } from "./tenant.service";
import { Request, Response } from "express";
import { BadRequestError } from "@common/errors";

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

    getTenant = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        return res.send({
            data: await this.tenantService.getTenantById(id),
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
        const files = req.files as { [fieldName: string]: Express.Multer.File[] };

        const frontFile = files?.['id_card_front_url']?.[0];
        const backFile = files?.['id_card_back_url']?.[0];

        if (!frontFile && !backFile) {
            throw new BadRequestError("At least one file (front or back) is required");
        }

        const data = await this.tenantService.addCardPhoto(id, {
            front: frontFile,
            back: backFile
        });

        return res.send({
            message: "Photo uploaded successfully",
            data,
        });
    };
    createTenant = async (req: Request, res: Response) => {
        const data: CreateTenantInput = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
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