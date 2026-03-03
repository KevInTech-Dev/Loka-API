import { Router } from "express";
import { LandLordController } from "./landLord.controller";
import validate from "../middleware/validate.middleware";
import { createlandLordSchema, landlordIdSchema, landlordPaginationSchema } from "./landlord.schema";
import authMiddleware from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorization.middleware";


const router: Router = Router();
const landlordController = new LandLordController();

router.get('', authMiddleware, authorize(['admin']), validate(landlordPaginationSchema, 'query'), landlordController.getAllLandlords);

router.get('/:id', authMiddleware, authorize(['admin']), landlordController.getlandLord);

router.patch('/:id', authMiddleware, authorize(['proprietaire', 'admin']), validate({
    params: landlordIdSchema,
    body: createlandLordSchema
}), landlordController.updatelandLord);

router.post('', authMiddleware, authorize(['proprietaire', 'admin']), validate(createlandLordSchema, 'body'), landlordController.createlandLord);

router.delete('/:id', authMiddleware, authorize(['admin']), validate(landlordIdSchema, 'params'), landlordController.deletelandLord);

export default router;