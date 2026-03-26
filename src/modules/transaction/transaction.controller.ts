import { CreateTransactionInput } from "./transaction.schema";
import { TransactionService } from "./transaction.service";
import { Request, Response } from "express";

export class TransactionController {
    private transactionService: TransactionService;

    constructor() {
        this.transactionService = new TransactionService();
    }

    async createTransaction(req: Request, res: Response) {
        const userId = req.user.id;
        const role = req.user.role;
        const data: CreateTransactionInput = req.body;
        return res.send({
            data: await this.transactionService.createTransaction(userId, role, {...data, sender_id: userId}),
        });
    }

    async getPaginatedTransactions(req: Request, res: Response) {
        const userId = req.user.id;
        const role = req.user.role;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await this.transactionService.getTransactions(userId, role, page, limit);
        return res.send({
            page,
            limit,
            total: result.total,
            data: result.data,
        });
    }

    async getTransactionById(req: Request, res: Response) {
        const userId = req.user.id;
        const role = req.user.role;
        const id = req.params.id as string;
        return res.send({
            data: await this.transactionService.getTransactionById(id, userId, role),
        });
    }
}