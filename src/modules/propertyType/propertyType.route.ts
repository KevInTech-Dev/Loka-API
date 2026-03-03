import { Router } from "express";
import { PropertyTypeController } from "./propertyType.controller";
import { createPropertyTypeSchema, propertyTypeIdShema } from "./propertyType.schema";
import validate from "../middleware/validate.middleware";
import { defaultPaginationQuery } from "@/common/api.schema";
import authMiddleware from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorization.middleware";

const router: Router = Router();
router.use(authMiddleware);
const propertyTypeController = new PropertyTypeController();

// create propertyType
router.post('', authMiddleware, authorize(['proprietaire', 'admin']), validate(createPropertyTypeSchema, 'body'), propertyTypeController.createpropertyType);

// get all propertyTpe
router.get('', authMiddleware, authorize(['proprietaire', 'admin']), validate(defaultPaginationQuery, 'body'), propertyTypeController.getAllpropertyType);

// delete propertyType by id
router.delete('/:id', authMiddleware, authorize(['proprietaire', 'admin']), validate(propertyTypeIdShema, 'params'), propertyTypeController.deletepropertyType);

// get propertyType by id
router.get('/:id', authMiddleware, authorize(['proprietaire', 'admin']), validate(propertyTypeIdShema, 'params'), propertyTypeController.getpropertyType);

// update propertyType by id
router.patch('/:id', authMiddleware, authorize(['proprietaire', 'admin']), validate({
    params: propertyTypeIdShema,
    body: createPropertyTypeSchema
}), propertyTypeController.updatepropertyType);

export default router;