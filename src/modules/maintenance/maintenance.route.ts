import { Router } from "express";
import { MaintenanceController } from "./maintenance.controller";
import { addTechnicalManager, changeStateOfMaintenance, createMaintenanceSchema, maintenanceIdSchema } from "./maintenance.schema";
import { defaultPaginationQuery } from "@/common/api.schema";
import validate from "../middleware/validate.middleware";

const router: Router = Router();
const maintenanceController = new MaintenanceController();

router.get('', validate(defaultPaginationQuery, "query"), maintenanceController.getMaintenancePaginated);
router.get('/:id', validate(maintenanceIdSchema, "params"), maintenanceController.getMaintenanceById);
router.post('', validate(createMaintenanceSchema, 'body'), maintenanceController.createMaintenance);
router.patch('/:id/change-state-maintenance', validate({ params: maintenanceIdSchema, body: changeStateOfMaintenance }), maintenanceController.changeStateOfMaintenance);
router.patch('/:id/add-technical-manager', validate({ params: maintenanceIdSchema, body: addTechnicalManager }), maintenanceController.addTechnicalManager);
router.patch('/:id', validate({ params: maintenanceIdSchema, body: createMaintenanceSchema }), maintenanceController.updateMaintenance);
router.delete('/:id', validate(maintenanceIdSchema, 'params'), maintenanceController.deleteMaintenance);

export default router;