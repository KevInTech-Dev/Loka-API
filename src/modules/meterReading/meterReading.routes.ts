import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { MeterReadingController } from "./meterReading.controller";
import { authorize } from "../middleware/authorization.middleware";
import { CreationMeterReadingSchema, MeterReadingIdSchema, UpdateMeterReadingSchema } from "./meterReading.schemas";
import validate from "../middleware/validate.middleware";
import { defaultPaginationQuery } from "@/common/api.schema";

const router: Router = Router();
router.use(authMiddleware);
const meterReandingController = new MeterReadingController();

router.get('', authorize(['admin', 'proprietaire']), validate(defaultPaginationQuery, 'query'), meterReandingController.getPaginatedMeterReading);

router.get('/:id', authorize(['admin', 'proprietaire']), validate(MeterReadingIdSchema, 'params'), meterReandingController.getMeterReading);

router.post('', authorize(['admin', 'proprietaire']), validate(CreationMeterReadingSchema, 'body'), meterReandingController.createMeterReading);

router.patch('/:id', authorize(['admin', 'proprietaire']), validate({
    params: MeterReadingIdSchema,
    body: UpdateMeterReadingSchema,
}), meterReandingController.updateMeterReading);

export default router;