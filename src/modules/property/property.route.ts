import { Router } from "express";
import { PropertyController } from "./property.controller";

const router : Router = Router();
const propertyController = new PropertyController();

// get all propertys
router.get('', propertyController.getAllProperty);


// get property by id
router.get('/:id', propertyController.getProperty);

// update property by id
router.patch('', propertyController.updateProperty);

// create property
router.post('', propertyController.createProperty);

// delete property by id
router.delete('/:id', propertyController.deleteProperty);

export default router;