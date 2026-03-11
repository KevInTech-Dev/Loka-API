import authMiddleware from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorization.middleware";
import { fieldsUpload } from "../middleware/upload.middleware";
import { contractController } from "./contract.controller";
import { contractIdSchema, contractPaginationSchema, createContractSchema } from "./contract.schemas";
import validate from "@modules/middleware/validate.middleware";
import {Router} from "express";

const router: Router = Router();
router.use(authMiddleware);
const ContractController = new contractController();

router.get('', 
    authorize(['admin', 'proprietaire']), 
validate(contractPaginationSchema, 'query'), ContractController.getAllContract);
router.get('/:id', 
    authorize(['admin', 'proprietaire']),
validate(contractIdSchema, 'params'), ContractController.getContract);

router.patch('/:id', 
    authorize(['proprietaire']),
validate({
    params: contractIdSchema,
    body: createContractSchema
}), ContractController.updateContract);

router.post('',
    authorize(['proprietaire']), 
validate(createContractSchema, 'body'), ContractController.createContract);

router.delete('/:id',
    authorize(['admin', 'proprietaire']), 
validate(contractIdSchema, 'params'), ContractController.deleteContract);

router.patch('/contractDoc_url/:id',fieldsUpload({
    fields: [
        {name: 'tenant_signature_url', maxCount: 1},
        {name: 'landlord_signature_url', maxCount: 1},
    ],
    subFolder: 'Contract_Doc',
    fileType: 'image',
}), validate(contractIdSchema, 'params'), ContractController.uploadContractDocUrl);

export default router;