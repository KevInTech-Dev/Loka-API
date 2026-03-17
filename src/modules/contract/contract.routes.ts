import authMiddleware from '@modules/middleware/authMiddleware';
import { authorize } from '@modules/middleware/authorization.middleware';
import { fieldsUpload } from '@modules/middleware/upload.middleware';
import { contractController } from '@modules/contract/contract.controller';
import { contractIdSchema, contractPaginationSchema, createContractSchema, manualRenewalSchema, manualSignatureSchema } from '@modules/contract/contract.schemas';
import validate from '@modules/middleware/validate.middleware';
import { Router } from 'express';

const router: Router = Router();
router.use(authMiddleware);
const ContractController = new contractController();

router.get(
  '',
  authorize(['admin', 'proprietaire']),
  validate(contractPaginationSchema, 'query'),
  ContractController.getAllContract,
);
router.get(
  '/:id',
  authorize(['admin', 'proprietaire']),
  validate(contractIdSchema, 'params'),
  ContractController.getContract,
);

router.patch(
  '/:id',
  authorize(['proprietaire']),
  validate({
    params: contractIdSchema,
    body: createContractSchema,
  }),
  ContractController.updateContract,
);

router.post(
  '',
  authorize(['proprietaire']),
  validate(createContractSchema, 'body'),
  ContractController.createContract,
);

router.delete(
  '/:id',
  authorize(['admin', 'proprietaire']),
  validate(contractIdSchema, 'params'),
  ContractController.deleteContract,
);

router.patch(
  '/contractDoc_url/:id',
  authorize(['proprietaire']),
  fieldsUpload({
    fields: [
      { name: 'tenant_signature_url', maxCount: 1 },
      { name: 'landlord_signature_url', maxCount: 1 },
    ],
    subFolder: 'Contract_Doc',
    fileType: 'image',
  }),
  validate(contractIdSchema, 'params'),
  ContractController.uploadContractDocUrl,
);

router.patch(
  '/manualRenewal/:id',
  authorize(['proprietaire']),
  validate({
     params: contractIdSchema,
    body: manualRenewalSchema,
  }),
  ContractController.manualRenewal,
);

router.patch('/manualSignature/:id',
  authorize(['admin','proprietaire']),
  validate({
    params: contractIdSchema,
    body: manualSignatureSchema,
  }),
  ContractController.manualContractSign,
);
router.patch('/terminateContract/:id',
  authorize(['admin','proprietaire']),
  validate({
    params: contractIdSchema,
  }),
  ContractController.terminateContract,
);

export default router;
