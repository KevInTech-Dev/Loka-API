import { Router } from "express";
import { LoginSchema, refreshTokenIdSchema, RegisterSchema } from "./auth.schema";
import validate from "../middleware/validate.middleware";
import { AuthController } from "./auth.controller";
import { defaultPaginationQuery } from "@/common/api.schema";

const router: Router = Router();
const authController = new AuthController();

router.post('/login', validate(LoginSchema, 'body'), authController.login)
router.post('/register', validate(RegisterSchema, 'body'), authController.register)
router.post('/refresh/:id', validate(refreshTokenIdSchema, 'params'), authController.refresh)
router.get('/get-all-refresh-token', validate(defaultPaginationQuery, 'query'), authController.getAllRefreshToken)

export default router;