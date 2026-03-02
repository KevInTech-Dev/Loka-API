import { Router } from "express";
import { LoginSchema, RegisterSchema } from "./auth.schema";
import validate from "../middleware/validate.middleware";
import { AuthController } from "./auth.controller";

const router: Router = Router();
const authController = new AuthController();

router.post('/login', validate(LoginSchema, 'body'), authController.login)
router.post('/register', validate(RegisterSchema, 'body'), authController.register)

export default router;