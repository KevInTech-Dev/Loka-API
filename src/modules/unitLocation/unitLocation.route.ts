import { Router } from "express";
import { createunitLocationSchema, unitLocationIdShema } from "./unitLocation.schema";
import validate from "../middleware/validate.middleware";
import { UnitLocationController } from "./unitLocation.controller";

const router: Router = Router();
const unitLocationController = new UnitLocationController();

// get all unitLocations
router.get('', unitLocationController.getAllUnitLocations);

// create unitLocation
router.post('', validate(createunitLocationSchema, 'body'), unitLocationController.createUnitLocation);

// get unitLocation by id
router.get('/:id', unitLocationController.getUnitLocation);

// update unitLocation by id
router.patch('/:id', validate({
    params: unitLocationIdShema,
    body: createunitLocationSchema
}), unitLocationController.updateUnitLocation);

// delete unitLocation by id
router.delete('/:id', validate(unitLocationIdShema, 'params'), unitLocationController.deleteUnitLocation);

export default router;