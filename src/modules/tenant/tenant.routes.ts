import {Router} from "express";
import {TenantController} from "./tenant.controller";
import validate from "../middleware/validate.middleware";
import {createTenantSchema, paginatedTenantSchema, tenantIdSchema} from "./tenant.schema";
import {singleUpload} from "@modules/middleware/upload.middleware";


const router: Router = Router();
const tenantController = new TenantController();

router.get('', validate(paginatedTenantSchema, 'query'), tenantController.getAllTenants);

router.post('',singleUpload({
    fieldName: 'id_card_front_url',
    subFolder: 'Tenant_card',
    fileType: 'image',
}), 
singleUpload({
    fieldName: 'id_card_back_url',
    subFolder: 'Tenant_card',
    fileType: 'image',
}),  validate(createTenantSchema, 'body'), tenantController.createTenant);

router.patch("/id_card_photo/:id", singleUpload({
    fieldName: 'id_card_front_url',
    subFolder: 'Tenant_card',
    fileType: 'image',
}) ,singleUpload({
    fieldName: 'id_card_back_url',
    subFolder: 'Tenant_card',
    fileType: 'image',
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