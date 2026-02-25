import { Router } from "express";
import { LandLordController } from "./landLord.controller";
import validate from "../middleware/validate.middleware";
import { createlandLordSchema, landlordIdSchema, landlordPaginationSchema } from "./landlord.schema";


const router: Router = Router();
const landlordController = new LandLordController();

router.get('', validate(landlordPaginationSchema, 'query'), landlordController.getAllLandlords);

router.get('/:id', landlordController.getlandLord);

router.patch('/:id', validate({
    params: landlordIdSchema,
    body: createlandLordSchema
}), landlordController.updatelandLord);

router.post('', validate(createlandLordSchema, 'body'),landlordController.createlandLord);

router.delete('/:id', validate(landlordIdSchema, 'params'),landlordController.deletelandLord);

export default router;