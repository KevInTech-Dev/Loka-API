import { Router } from "express";
import authMiddleware from "@modules/middleware/authMiddleware";
import { authorize } from "@modules/middleware/authorization.middleware";
import validate from "@modules/middleware/validate.middleware";
import { PaymentController } from "./payment.controller";
import { CreatePaymentSchema, paymentIdSchema, paymentPaginationSchema } from "./payment.schema";

const router: Router = Router();
const paymentController = new PaymentController();

router.use(authMiddleware);

router.post(
	"",
	authorize(["locataire", "proprietaire", "admin"]),
	validate(CreatePaymentSchema, "body"),
	paymentController.createPayment,
);

router.get(
	"",
	authorize(["locataire", "proprietaire", "admin"]),
	validate(paymentPaginationSchema, "query"),
	paymentController.getPayments,
);

router.get(
	"/:id",
	authorize(["locataire", "proprietaire", "admin"]),
	validate(paymentIdSchema, "params"),
	paymentController.getPayment,
);

export default router;
