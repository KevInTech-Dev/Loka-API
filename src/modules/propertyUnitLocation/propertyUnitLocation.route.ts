import { Router } from "express";
import { createpropertyUnitLocationSchema, propertyUnitLocationIdShema } from "./propertyUnitLocation.schema";
import validate from "../middleware/validate.middleware";
import { PropertyUnitLocationController } from "./propertyUnitLocation.controller";

const router: Router = Router();
const propertyUnitLocationController = new PropertyUnitLocationController();

// get all propertyUnitLocations
router.get('', propertyUnitLocationController.getAllpropertyUnitLocations);

// create propertyUnitLocation
router.post('', validate(createpropertyUnitLocationSchema, 'body'), propertyUnitLocationController.createpropertyUnitLocation);

// get propertyUnitLocation by id
router.get('/:id', propertyUnitLocationController.getpropertyUnitLocation);

// update propertyUnitLocation by id
router.patch('/:id', validate({
    params: propertyUnitLocationIdShema,
    body: createpropertyUnitLocationSchema
}), propertyUnitLocationController.updatepropertyUnitLocation);

// delete propertyUnitLocation by id
router.delete('/:id', validate(propertyUnitLocationIdShema, 'params'), propertyUnitLocationController.deletepropertyUnitLocation);

export default router;