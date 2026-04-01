import { Router } from "express";
import { RefundController } from "./refund.controller";
import { validate } from "../middleware/validate.middleware";
import { allowRefundSchema, refundIdSchema, refundPaymentPagination, RefundSchema } from "./refund.schema";

const router: Router = Router();

const refundPaymentController = new RefundController();

router.post('', validate(RefundSchema, "body"), refundPaymentController.initializeRefundPayment);

router.get('', validate(refundPaymentPagination, 'query'), refundPaymentController.getRefundPaymentsPaginated);

router.get('/:id', validate(refundIdSchema, 'params'), refundPaymentController.getRefundPaymentById);

router.patch('/:id', validate({
    'query' : refundIdSchema,
    'body' : allowRefundSchema
}), refundPaymentController.approveRefund);

export default router;