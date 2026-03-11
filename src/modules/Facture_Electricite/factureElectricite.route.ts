import { Router } from "express";
import { defaultPaginationQuery } from "@/common/api.schema";
import { FactureElectriciteController } from "./facture.controller";
import { createFactureElectriciteSchema, factureElectriciteIdSchema } from "./facture.schema";
import validate from "../middleware/validate.middleware";

const router: Router = Router();
const factureElectriciteController = new FactureElectriciteController();

router.post('', validate(createFactureElectriciteSchema, 'body'), factureElectriciteController.createFactureElectricite);

router.get('', validate(defaultPaginationQuery, 'query'), factureElectriciteController.getAllFactureElectricitePaginated);

router.delete('/:id', validate(factureElectriciteIdSchema, 'params'), factureElectriciteController.deleteFactureElectricite);

router.get('/:id', validate(factureElectriciteIdSchema, 'params'), factureElectriciteController.getFactureElectriciteById);

router.patch('/:id', validate({ params: factureElectriciteIdSchema, body: createFactureElectriciteSchema }), factureElectriciteController.updateFactureElectricite);

export default router;