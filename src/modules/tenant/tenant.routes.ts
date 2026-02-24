import { Router } from "express";
import { TenantController } from "./tenant.controller";
import validate from "../middleware/validate.middleware";
import { createTenantSchema, tenantIdSchema } from "./tenant.schema";


const router: Router = Router();
const tenantController = new TenantController();

router.get('', tenantController.getAllTenants);

router.post('', validate(createTenantSchema, 'body'), tenantController.createTenant);

router.get('/:id', tenantController.getTenant);

router.patch('/:id', validate({
    params: tenantIdSchema,
    body: createTenantSchema
}), tenantController.updateTenant);

router.delete('/:id', validate(tenantIdSchema, 'params'), tenantController.deleteTenant);

export default router;