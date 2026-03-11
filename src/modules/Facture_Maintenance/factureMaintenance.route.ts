import { Router } from "express";
import { defaultPaginationQuery } from "@/common/api.schema";
import { FactureMaintenanceController } from "./facture.controller";
import { createFactureMaintenanceSchema, factureMaintenanceIdSchema } from "./facture.schema";
import validate from "../middleware/validate.middleware";

const router: Router = Router();
const factureMaintenanceController = new FactureMaintenanceController();

router.post('', validate(createFactureMaintenanceSchema, 'body'), factureMaintenanceController.createFactureMaintenance);

router.get('', validate(defaultPaginationQuery, 'query'), factureMaintenanceController.getAllFactureMaintenancePaginated);

router.delete('/:id', validate(factureMaintenanceIdSchema, 'params'), factureMaintenanceController.deleteFactureMaintenance);

router.get('/:id', validate(factureMaintenanceIdSchema, 'params'), factureMaintenanceController.getFactureMaintenanceById);

router.patch('/:id', validate({ params: factureMaintenanceIdSchema, body: createFactureMaintenanceSchema }), factureMaintenanceController.updateFactureMaintenance);

export default router;