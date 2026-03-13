import { Router } from "express";
import { TechnicalManagerController } from "./technicalManger.controller";
import { technicalManagerIdSchema, technicalMangerSchema } from "./technicalManger.schema";
import validate from "../middleware/validate.middleware";
import { createMaintenanceSchema, maintenanceIdSchema } from "../maintenance/maintenance.schema";
import { defaultPaginationQuery } from "@/common/api.schema";

const router: Router = Router();
const technicalMangerController = new TechnicalManagerController();

router.get('', validate(defaultPaginationQuery, "query"), technicalMangerController.getTechnicalMangerPaginated);
router.get('/:id', validate(technicalManagerIdSchema, "params"), technicalMangerController.getTechnicalManagerById);
router.post('', validate(technicalMangerSchema, 'body'), technicalMangerController.createTechnicalManager);
router.patch('/:id', validate({ params: maintenanceIdSchema, body: createMaintenanceSchema }), technicalMangerController.updateTechnicalManger);
router.delete('/:id', validate(technicalManagerIdSchema, 'params'), technicalMangerController.deleteTechnicalManger);

export default router;
