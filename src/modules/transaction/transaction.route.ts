import { Router } from "express";
import authMiddleware from "@modules/middleware/authMiddleware";
import { authorize } from "@modules/middleware/authorization.middleware";
import validate from "@modules/middleware/validate.middleware";
import { TransactionController } from "./transaction.controller";
import { CreateTransactionSchema, transactionIdSchema, transactionPaginationSchema } from "./transaction.schema";


const router: Router = Router();
const transactionController = new TransactionController();

router.use(authMiddleware);

router.post(
    "",
    authorize(["locataire", "proprietaire", "admin"]),
    validate(CreateTransactionSchema, "body"),
    transactionController.createTransaction,
);
router.get(
    "",
    authorize(["locataire", "proprietaire", "admin"]),
    validate(transactionPaginationSchema, "query"),
    transactionController.getPaginatedTransactions,
);
router.get(
    "/:id",
    authorize(["locataire", "proprietaire", "admin"]),
    validate(transactionIdSchema, "params"),
    transactionController.getTransactionById,
);

export default router;