import { Router } from "express";
import { createUnitLocationSchema, unitLocationIdShema } from "./unitLocation.schema";
import validate from "../middleware/validate.middleware";
import { UnitLocationController } from "./unitLocation.controller";
import { defaultPaginationQuery } from "@/common/api.schema";

const router: Router = Router();
const unitLocationController = new UnitLocationController();

// get all unitLocations
router.get('', validate(defaultPaginationQuery, 'query'), unitLocationController.getAllUnitLocations);

// create unitLocation
router.post('', validate(createUnitLocationSchema, 'body'), unitLocationController.createUnitLocation);

// get unitLocation by id
router.get('/:id', validate(unitLocationIdShema, 'params'), unitLocationController.getUnitLocation);

// update unitLocation by id
router.patch('/:id', validate({
    params: unitLocationIdShema,
    body: createUnitLocationSchema
}), unitLocationController.updateUnitLocation);

// delete unitLocation by id
router.delete('/:id', validate(unitLocationIdShema, 'params'), unitLocationController.deleteUnitLocation);

export default router;