import { Router } from "express";
import { createUnitTypeSchema, unitTypeIdShema } from "./unitType.schema";
import validate from "../middleware/validate.middleware";
import { UnitTypeController } from "./unitType.controller";
import { defaultPaginationQuery } from "@/common/api.schema";
import authMiddleware from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorization.middleware";

const router: Router = Router();
const unitTypeController = new UnitTypeController();

// get all unitTypes
router.get('', authMiddleware, authorize(['proprietaire', 'admin']), validate(defaultPaginationQuery, 'query'), unitTypeController.getAllUnitTypes);

// create unitType
router.post('', authMiddleware, authorize(['proprietaire', 'admin']), validate(createUnitTypeSchema, 'body'), unitTypeController.createUnitType);

// get unitType by id
router.get('/:id', authMiddleware, authorize(['proprietaire', 'admin']), validate(unitTypeIdShema, 'params'), unitTypeController.getUnitType);

// update unitType by id
router.patch('/:id', authMiddleware, authorize(['proprietaire', 'admin']), validate({
    params: unitTypeIdShema,
    body: createUnitTypeSchema
}), unitTypeController.updateUnitType);

// delete unitType by id
router.delete('/:id', authMiddleware, authorize(['proprietaire', 'admin']), validate(unitTypeIdShema, 'params'), unitTypeController.deleteUnitType);

export default router;