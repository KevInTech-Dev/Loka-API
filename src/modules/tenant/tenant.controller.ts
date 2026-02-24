import { CreateTenantInput } from "./tenant.schema";
import { TenantService } from "./tenant.service";
import { Request, Response } from "express";

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

    createTenant = async (req: Request, res: Response) => {
        const data: CreateTenantInput = req.body;
        return res.send({
            data: await this.tenantService.createTenant(data),
        });
    }

    deleteTenant = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    return res.send({
      data: await this.tenantService.deleteTenant(id),
    });
  }
}