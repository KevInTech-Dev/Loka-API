import { Router } from "express";
import { RefundController } from "./refund.controller";
import { validate } from "../middleware/validate.middleware";
import { allowRefundSchema, refundIdSchema, refundPaymentPagination, RefundSchema } from "./refund.schema";
import authMiddleware from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorization.middleware";

const router: Router = Router();
router.use(authMiddleware);
const refundPaymentController = new RefundController();

router.post('', authorize(['tenant']), validate(RefundSchema, "body"), refundPaymentController.initializeRefundPayment);

router.get('', authorize(['tenant', 'landlord', 'admin']), validate(refundPaymentPagination, 'query'), refundPaymentController.getRefundPaymentsPaginated);

router.get('/:id', authorize(['tenant', 'landlord', 'admin']), validate(refundIdSchema, 'params'), refundPaymentController.getRefundPaymentById);

router.patch('/:id', authorize(['landlord', 'admin']), validate({
    'query' : refundIdSchema,
    'body' : allowRefundSchema
}), refundPaymentController.approveRefund);

export default router;