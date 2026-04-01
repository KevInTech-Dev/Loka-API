import { RefundPaymentService } from "@modules/Refund/refund.service";
import { Request, Response } from "express";
import { allowRefundSchemaType, RefundSchemaType } from "./refund.schema";

export class RefundController {
    private refundService: RefundPaymentService;
    
    constructor() {
        this.refundService = new RefundPaymentService();
    }

    initializeRefundPayment = async (req: Request, res: Response) => {
        const userId = req.user.id;
        const data : RefundSchemaType = req.body;
        const refundPayment = await this.refundService.createRdefundPayment(userId, data);
        return res.send({ data: refundPayment });
    }

    getRefundPaymentById = async (req: Request, res: Response) => {
        const  id  = req.params.id as string;
        const refundPayment = await this.refundService.getRefundPaymentById(id);
        return res.send({ data: refundPayment });
    }

    getRefundPaymentsPaginated = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await this.refundService.getRefundPaymentsPaginated(page, limit);
        return res.send({
            page,
            limit,
            total: result.total,
            data: result.data,
        });
    }

    approveRefund = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const data : allowRefundSchemaType = req.body;
        return res.send(await this.refundService.approveRefund(id, data));
    }

    approveRefundAdmin = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const data : allowRefundSchemaType = req.body;
        return res.send(await this.refundService.approveRefundAdmin(id, data));
    }
}