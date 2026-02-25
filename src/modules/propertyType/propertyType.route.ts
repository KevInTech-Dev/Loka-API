import { Router } from "express";
import { PropertyTypeController } from "./propertyType.controller";
import { createPropertyTypeSchema, propertyTypeIdShema } from "./propertyType.schema";
import validate from "../middleware/validate.middleware";
import { defaultPaginationQuery } from "@/common/api.schema";

const router: Router = Router();
const propertyTypeController = new PropertyTypeController();

// create propertyType
router.post('', validate(createPropertyTypeSchema, 'body'), propertyTypeController.createpropertyType);

// get all propertyTpe
router.get('', validate(defaultPaginationQuery, 'body'), propertyTypeController.getAllpropertyType);

// delete propertyType by id
// router.delete('/:id', validate(propertyTypeIdShema, 'params'), propertyTypeController.deletepropertyType);

// get propertyType by id
router.get('/:id', validate(propertyTypeIdShema, 'params'), propertyTypeController.getpropertyType);

// update propertyType by id
router.patch('/:id', validate({
    params: propertyTypeIdShema,
    body: createPropertyTypeSchema
}), propertyTypeController.updatepropertyType);

export default router;