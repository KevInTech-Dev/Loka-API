import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

export class PaymentController {
	private readonly paymentService: PaymentService;

	constructor() {
		this.paymentService = new PaymentService();
	}

	getPayments = async (req: Request, res: Response) => {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;

		const result = await this.paymentService.getPaymentsPaginated(req.user.id, req.user.role, page, limit);

		return res.send({
			page,
			limit,
			total: result.total,
			data: result.data,
		});
	};

	getPayment = async (req: Request, res: Response) => {
		const id = req.params.id as string;
		return res.send({
			data: await this.paymentService.getPaymentById(id, req.user.id, req.user.role),
		});
	};
}
