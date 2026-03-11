import { Router } from "express";
import { defaultPaginationQuery } from "@/common/api.schema";
import { FactureEauController } from "./facture.controller";
import validate from "../middleware/validate.middleware";
import { creationFactureEauSchema, factureEauIdSchema } from "./facture.schema";

const router: Router = Router();
const factureEauController = new FactureEauController();

router.post('', validate(creationFactureEauSchema, 'body'), factureEauController.createFactureEau);

router.get('', validate(defaultPaginationQuery, 'query'), factureEauController.getAllFactureEauPaginated);

router.delete('/:id', validate(factureEauIdSchema, 'params'), factureEauController.deleteFactureEau);

router.get('/:id', validate(factureEauIdSchema, 'params'), factureEauController.getFactureEauById);

router.patch('/:id', validate({ params: factureEauIdSchema, body: creationFactureEauSchema }), factureEauController.updateFactureEau);

export default router;