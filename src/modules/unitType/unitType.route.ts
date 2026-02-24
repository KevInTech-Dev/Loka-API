import { Router } from "express";
import { createunitTypeSchema, unitTypeIdShema } from "./unitType.schema";
import validate from "../middleware/validate.middleware";
import { UnitTypeController } from "./unitType.controller";

const router: Router = Router();
const unitTypeController = new UnitTypeController();

// get all unitTypes
router.get('', unitTypeController.getAllUnitTypes);

// create unitType
router.post('', validate(createunitTypeSchema, 'body'), unitTypeController.createUnitType);

// get unitType by id
router.get('/:id', unitTypeController.getUnitType);

// update unitType by id
router.patch('/:id', validate({
    params: unitTypeIdShema,
    body: createunitTypeSchema
}), unitTypeController.updateUnitType);

// delete unitType by id
router.delete('/:id', validate(unitTypeIdShema, 'params'), unitTypeController.deleteUnitType);

export default router;