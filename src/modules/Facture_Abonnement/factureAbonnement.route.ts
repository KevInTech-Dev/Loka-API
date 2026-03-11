import { Router } from "express";
import { defaultPaginationQuery } from "@/common/api.schema";
import { FactureAbonnementController } from "./facture.controller";
import { createFactureAbonnementSchema, factureAbonnementIdSchema } from "./facture.schema";
import validate from "../middleware/validate.middleware";

const router: Router = Router();
const factureAbonnementController = new FactureAbonnementController();

router.post('', validate(createFactureAbonnementSchema, 'body'), factureAbonnementController.createFactureAbonnement);

router.get('', validate(defaultPaginationQuery, 'query'), factureAbonnementController.getAllFactureAbonnementPaginated);

router.delete('/:id', validate(factureAbonnementIdSchema, 'params'), factureAbonnementController.deleteFactureAbonnement);

router.get('/:id', validate(factureAbonnementIdSchema, 'params'), factureAbonnementController.getFactureAbonnementById);

router.patch('/:id', validate({ params: factureAbonnementIdSchema, body: createFactureAbonnementSchema }), factureAbonnementController.updateFactureAbonnement);

export default router;