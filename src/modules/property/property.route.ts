import { Router } from "express";
import { PropertyController } from "./property.controller";
import { createPropertySchema, propertyIdShema } from "./property.schema";
import validate from "../middleware/validate.middleware";

const router: Router = Router();
const propertyController = new PropertyController();

// create property
router.post('', validate(createPropertySchema, 'body'), propertyController.createProperty);

// get all propertys
router.get('', propertyController.getAllProperty);

// delete property by id
router.delete('/:id', validate(propertyIdShema, 'params'), propertyController.deleteProperty);

// get property by id
router.get('/:id', validate(propertyIdShema, 'params'), propertyController.getProperty);

// update property by id
router.patch('/:id', validate({
    params: propertyIdShema,
    body: createPropertySchema
}), propertyController.updateProperty);

export default router;