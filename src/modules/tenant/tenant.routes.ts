import {Router} from "express";
import {TenantController} from "./tenant.controller";
import validate from "../middleware/validate.middleware";
import {createTenantSchema, paginatedTenantSchema, tenantIdSchema} from "./tenant.schema";
import {fieldsUpload} from "@modules/middleware/upload.middleware";
import authMiddleware from "@modules/middleware/authMiddleware";


const router: Router = Router();
router.use(authMiddleware);
const tenantController = new TenantController();

router.get('', validate(paginatedTenantSchema, 'query'), tenantController.getAllTenants);

router.post('', fieldsUpload({
    fields: [
        {name: 'photo', maxCount: 1},
        {name: 'id_card_back_url', maxCount: 1},
        {name: 'id_card_front_url', maxCount: 1},
    ],
    subFolder: 'Tenant_card',
    fileType: 'image',
}), validate(createTenantSchema, 'body'), tenantController.createTenant);


router.patch("/photo/:id",
    fieldsUpload({
        fields: [
            {name: 'id_card_front_url', maxCount: 1},
            {name: 'id_card_back_url', maxCount: 1},
        ],
        subFolder: 'Tenant_card',
        fileType: 'image',
    }),
    validate({
        params: tenantIdSchema,
    }),
    tenantController.addCardPhoto
);

router.get('/:id', tenantController.getTenant);

router.patch('/:id', validate({
    params: tenantIdSchema,
    body: createTenantSchema
}), tenantController.updateTenant);

router.delete('/:id', validate(tenantIdSchema, 'params'), tenantController.deleteTenant);

export default router;