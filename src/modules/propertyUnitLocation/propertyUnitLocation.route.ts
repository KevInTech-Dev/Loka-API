import { Router } from "express";
import { createpropertyUnitLocationSchema, propertyUnitLocationIdShema } from "./propertyUnitLocation.schema";
import validate from "../middleware/validate.middleware";
import { PropertyUnitLocationController } from "./propertyUnitLocation.controller";
import { defaultPaginationQuery } from "@/common/api.schema";
import authMiddleware from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorization.middleware";

const router: Router = Router();
const propertyUnitLocationController = new PropertyUnitLocationController();

// get all propertyUnitLocations
router.get('', authMiddleware, authorize(['proprietaire', 'admin']), validate(defaultPaginationQuery, 'query'), propertyUnitLocationController.getAllpropertyUnitLocations);

// create propertyUnitLocation
router.post('', authMiddleware, authorize(['proprietaire', 'admin']), validate(createpropertyUnitLocationSchema, 'body'), propertyUnitLocationController.createpropertyUnitLocation);

// get propertyUnitLocation by id
router.get('/:id', authMiddleware, authorize(['proprietaire', 'admin']), validate(propertyUnitLocationIdShema, 'params'), propertyUnitLocationController.getpropertyUnitLocation);

// update propertyUnitLocation by id
router.patch('/:id', authMiddleware, authorize(['proprietaire', 'admin']), validate({
    params: propertyUnitLocationIdShema,
    body: createpropertyUnitLocationSchema
}), propertyUnitLocationController.updatepropertyUnitLocation);

// delete propertyUnitLocation by id
router.delete('/:id', authMiddleware, authorize(['proprietaire', 'admin']), validate(propertyUnitLocationIdShema, 'params'), propertyUnitLocationController.deletepropertyUnitLocation);

export default router;