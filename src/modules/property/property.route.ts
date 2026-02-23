import { Router } from "express";
import { PropertyController } from "./property.controller";
import { createPropertySchema, propertyIdShema } from "./property.schema";
import validate from "../middleware/validate.middleware";

const router : Router = Router();
const propertyController = new PropertyController();

// get all propertys
router.get('', propertyController.getAllProperty);


// get property by id
router.get('/:id', propertyController.getProperty);

// update property by id
router.patch('', propertyController.updateProperty);

// create property
router.post('', validate(createPropertySchema, 'body'),propertyController.createProperty);

// delete property by id
router.delete('/:id', validate(propertyIdShema, 'params'),propertyController.deleteProperty);

export default router;