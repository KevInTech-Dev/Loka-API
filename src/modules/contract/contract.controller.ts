import { ContractService } from "@modules/contract/contract.service";
import {Request, Response} from "express";
import { createContractInput } from "@modules/contract/contract.schemas";

export class contractController {
    private readonly contractService : ContractService;
    
    constructor() {
        this.contractService = new ContractService();
    }

    getAllContract = async(req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        return res.send({
            page: req.query.page,
            limit: req.query.limit,
            data: await this.contractService.getPaginatedContract(page, limit)
        });
    }

    getContract = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        return res.send({
            data: await this.contractService.getContractById(id),
        });
    }

    updateContract = async (req: Request, res: Response) => {
            const id = req.params.id as string;
            const data = req.body as Partial<createContractInput>;
            return res.send({
                data: await this.contractService.updateContract(id, data),
            })
    }
    
    createContract = async (req: Request, res: Response) => {
            const data: createContractInput = req.body;
            return res.send({
                data: await this.contractService.createContract(data),
            });
    }

    deleteContract = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        return res.send({
          data: await this.contractService.deleteContract(id),
        });
      }
}