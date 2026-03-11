import { Router } from "express";
import { defaultPaginationQuery } from "@/common/api.schema";
import { FactureLoyerController } from "./facture.controller";
import { createFactureLoyerSchema, factureLoyerIdSchema } from "./facture.schema";
import validate from "../middleware/validate.middleware";

const router: Router = Router();
const factureLoyerController = new FactureLoyerController();

router.post('', validate(createFactureLoyerSchema, 'body'), factureLoyerController.createFactureLoyer);

router.get('', validate(defaultPaginationQuery, 'query'), factureLoyerController.getAllFactureLoyerPaginated);

router.delete('/:id', validate(factureLoyerIdSchema, 'params'), factureLoyerController.deleteFactureLoyer);

router.get('/:id', validate(factureLoyerIdSchema, 'params'), factureLoyerController.getFactureLoyerById);

router.patch('/:id', validate({ params: factureLoyerIdSchema, body: createFactureLoyerSchema }), factureLoyerController.updateFactureLoyer);

export default router;