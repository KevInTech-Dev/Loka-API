import { Router } from "express";
import { PropertyTypeController } from "./propertyType.controller";

const router : Router = Router();
const propertyTypeController = new PropertyTypeController();

// get all propertyTpe
router.get('', propertyTypeController.getAllpropertyType);

// get propertyType by id
router.get('/:id', propertyTypeController.getpropertyType);

// update propertyType by id
router.patch('', propertyTypeController.updatepropertyType);

// create propertyType
router.post('', propertyTypeController.createpropertyType);

// delete propertyType by id
router.delete('/:id', propertyTypeController.deletepropertyType);

export default router;