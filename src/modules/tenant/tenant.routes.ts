import {Router} from "express";
import {TenantController} from "./tenant.controller";
import validate from "../middleware/validate.middleware";
import {createTenantSchema, paginatedTenantSchema, tenantIdSchema} from "./tenant.schema";
import {singleUpload} from "@modules/middleware/upload.middleware";
import authMiddleware from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorization.middleware";


const router: Router = Router();
const tenantController = new TenantController();

router.get('', authMiddleware, authorize(['proprietaire', 'admin']),validate(paginatedTenantSchema, 'query'), tenantController.getAllTenants);

router.post('', authMiddleware, authorize(['proprietaire', 'admin']),singleUpload({
    fieldName: "photo",
    fileType: 'image',
    subFolder: "profiles",
}) /*,singleUpload({
    fieldName: "id_card_front_url ",
    fileType: 'image',
    subFolder: "tenants",
}), singleUpload({
    fieldName: "id_card_back_url ",
    fileType: 'image',
    subFolder: "tenants",
})*/, validate(createTenantSchema, 'body'), tenantController.createTenant);

router.get('/:id', authMiddleware, authorize(['proprietaire', 'admin']),tenantController.getTenant);

router.patch('/:id', authMiddleware, authorize(['proprietaire', 'admin']),validate({
    params: tenantIdSchema,
    body: createTenantSchema
}), tenantController.updateTenant);

router.delete('/:id', authMiddleware, authorize(['proprietaire', 'admin']),validate(tenantIdSchema, 'params'), tenantController.deleteTenant);

export default router;