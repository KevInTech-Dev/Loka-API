import { Router } from "express";
import authMiddleware from "@modules/middleware/authMiddleware";
import { authorize } from "@modules/middleware/authorization.middleware";
import validate from "@modules/middleware/validate.middleware";
import { TransactionController } from "./transaction.controller";
import { CreateTransactionSchema, transactionIdSchema, transactionPaginationSchema } from "./transaction.schema";


const router: Router = Router();
const transactionController = new TransactionController();



router.post(
    "",
    authMiddleware,
    authorize(["locataire", "proprietaire", "admin"]),
    validate(CreateTransactionSchema, "body"),
    transactionController.createTransaction,
);
router.get(
    "",
    authMiddleware,
    authorize(["locataire", "proprietaire", "admin"]),
    validate(transactionPaginationSchema, "query"),
    transactionController.getPaginatedTransactions,
);

router.get("/callback", transactionController.getCallBackUrl);
router.get(
    "/:id",
    authMiddleware,
    authorize(["locataire", "proprietaire", "admin"]),
    validate(transactionIdSchema, "params"),
    transactionController.getTransactionById,
);

export default router;