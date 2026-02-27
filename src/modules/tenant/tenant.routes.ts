import {Router} from "express";
import {TenantController} from "./tenant.controller";
import validate from "../middleware/validate.middleware";
import {createTenantSchema, paginatedTenantSchema, tenantIdSchema} from "./tenant.schema";
import {multipleUpload, singleUpload} from "@modules/middleware/upload.middleware";


const router: Router = Router();
const tenantController = new TenantController();

router.get('', validate(paginatedTenantSchema, 'query'), tenantController.getAllTenants);

router.post('',multipleUpload({
    fieldName: 'id_card_photo',
    subFolder: 'Tenant_card',
    fileType: 'image',
    maxFileSize: 2,
}), validate(createTenantSchema, 'body'), tenantController.createTenant);

router.patch("/id_card_photo/:id", multipleUpload({
    fieldName: 'id_card_photo',
    subFolder: 'Tenant_card',
    fileType: 'image',
    maxFileSize: 2,
}) , validate({
    params: tenantIdSchema,
}), tenantController.addCardPhoto);
router.get('/:id', tenantController.getTenant);

router.patch('/:id', validate({
    params: tenantIdSchema,
    body: createTenantSchema
}), tenantController.updateTenant);

router.delete('/:id', validate(tenantIdSchema, 'params'), tenantController.deleteTenant);

export default router;