import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorization.middleware";
import { LandLordController } from "@modules/landLord/landLord.controller";
import validate from "@modules/middleware/validate.middleware";
import { createlandLordSchema, landlordIdSchema, landlordPaginationSchema } from "@modules/landLord/landlord.schema";

const router: Router = Router();
router.use(authMiddleware);
const landlordController = new LandLordController();

router.get('',  authorize(['proprietaire', 'admin']), validate(landlordPaginationSchema, 'query'), landlordController.getAllLandlords);

router.post('', validate(createlandLordSchema, 'body'), landlordController.addLandlordInfo);


router.get('/:id', authorize(['admin']), validate(landlordIdSchema, 'params'), landlordController.getlandLord);

router.patch('/:id', authorize(['proprietaire', 'admin']),
    validate({
        params: landlordIdSchema,
        body: createlandLordSchema
    }), landlordController.updatelandLord);

router.delete('/:id', authorize(['admin']), validate(landlordIdSchema, 'params'), landlordController.deletelandLord);

export default router;