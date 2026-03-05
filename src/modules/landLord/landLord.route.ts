import { Router } from "express";
import { LandLordController } from "@modules/landLord/landLord.controller";
import validate from "@modules/middleware/validate.middleware";
import { createlandLordSchema, landlordIdSchema, landlordPaginationSchema } from "@modules/landLord/landlord.schema";


const router: Router = Router();
const landlordController = new LandLordController();

router.get('', validate(landlordPaginationSchema, 'query'), landlordController.getAllLandlords);

router.get('/:id', landlordController.getlandLord);

router.patch('/:id', validate({
    params: landlordIdSchema,
    body: createlandLordSchema
}), landlordController.updatelandLord);

router.post('', validate(createlandLordSchema, 'body'),landlordController.addLandlordInfo);

router.delete('/:id', validate(landlordIdSchema, 'params'),landlordController.deletelandLord);

export default router;