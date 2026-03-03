import { contractController } from "./contract.controller";
import { contractIdSchema, contractPaginationSchema, createContractSchema } from "./contract.schemas";
import validate from "@modules/middleware/validate.middleware";
import {Router} from "express";

const router: Router = Router();
const ContractController = new contractController();

router.get('', validate(contractPaginationSchema, 'query'), ContractController.getAllContract);
router.get('/:id', ContractController.getContract);

router.patch('/:id', validate({
    params: contractIdSchema,
    body: createContractSchema
}), ContractController.updateContract);

router.post('', validate(createContractSchema, 'body'), ContractController.createContract);

router.delete('/:id', validate(contractIdSchema, 'params'), ContractController.deleteContract);

export default router;