import { Router } from "express";
import { createUnitTypeSchema, unitTypeIdShema } from "./unitType.schema";
import validate from "../middleware/validate.middleware";
import { UnitTypeController } from "./unitType.controller";
import { defaultPaginationQuery } from "@/common/api.schema";

const router: Router = Router();
const unitTypeController = new UnitTypeController();

// get all unitTypes
router.get('', validate(defaultPaginationQuery, 'query'), unitTypeController.getAllUnitTypes);

// create unitType
router.post('', validate(createUnitTypeSchema, 'body'), unitTypeController.createUnitType);

// get unitType by id
router.get('/:id', validate(unitTypeIdShema, 'params'), unitTypeController.getUnitType);

// update unitType by id
router.patch('/:id', validate({
    params: unitTypeIdShema,
    body: createUnitTypeSchema
}), unitTypeController.updateUnitType);

// delete unitType by id
router.delete('/:id', validate(unitTypeIdShema, 'params'), unitTypeController.deleteUnitType);

export default router;