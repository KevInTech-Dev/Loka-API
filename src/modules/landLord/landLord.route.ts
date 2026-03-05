import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorization.middleware";
import { LandLordController } from "@modules/landLord/landLord.controller";
import validate from "@modules/middleware/validate.middleware";
import { createlandLordSchema, landlordIdSchema, landlordPaginationSchema } from "@modules/landLord/landlord.schema";


const router: Router = Router();
const landlordController = new LandLordController();

router.get('', authMiddleware, authorize(['admin']), validate(landlordPaginationSchema, 'query'), landlordController.getAllLandlords);

router.post('', authMiddleware, authorize(['proprietaire', 'admin']), validate(createlandLordSchema, 'body'), landlordController.addLandlordInfo);

router.get('/:id', authMiddleware, authorize(['admin']), landlordController.getlandLord);

router.patch('/:id', authMiddleware, authorize(['proprietaire', 'admin']), validate({
    params: landlordIdSchema,
    body: createlandLordSchema
}), landlordController.updatelandLord);

router.delete('/:id', authMiddleware, authorize(['admin']), validate(landlordIdSchema, 'params'), landlordController.deletelandLord);

export default router;