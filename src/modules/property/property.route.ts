import { Router } from "express";
import { PropertyController } from "./property.controller";
import { createPropertySchema, propertyIdShema } from "./property.schema";
import validate from "../middleware/validate.middleware";
import { defaultPaginationQuery } from "@/common/api.schema";
import { singleUpload } from "../middleware/upload.middleware";
import authMiddleware from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorization.middleware";

const router: Router = Router();
//router.use(authMiddleware);
const propertyController = new PropertyController();

// create property
router.post('', /*authMiddleware, authorize(['proprietaire', 'admin']),*/ validate(createPropertySchema, 'body'), propertyController.createProperty);

// get all propertys
router.get('', /*authMiddleware, authorize(['proprietaire', 'admin']),*/ validate(defaultPaginationQuery, 'query'), propertyController.getAllProperty);

// delete property by id
router.delete('/:id', authMiddleware, authorize(['proprietaire', 'admin']), validate(propertyIdShema, 'params'), propertyController.deleteProperty);

// get property by id
router.get('/:id', authMiddleware, authorize(['proprietaire', 'admin']), validate(propertyIdShema, 'params'), propertyController.getProperty);

// add document
router.post("/documents/:id", authMiddleware, authorize(['proprietaire', 'admin']), validate(propertyIdShema, 'params'), singleUpload({
    fieldName: "documents",
    fileType: 'image',
    subFolder: "property",
}), propertyController.addDocuments);

// update property by id
router.patch('/:id', authMiddleware, authorize(['proprietaire', 'admin']), validate({
    params: propertyIdShema,
    body: createPropertySchema
}), propertyController.updateProperty);

export default router;