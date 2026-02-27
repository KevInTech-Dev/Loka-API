import { sendSuccess } from "@/common/api.response";
import { LoginInput } from "./auth.schema"
import { AuthService } from "./login.service";

import { Request, Response } from 'express'

export class AuthController {

    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }


    login = async (res: Response, req: Request) => {
        sendSuccess(
            res,
            this.authService.login(req.body as LoginInput),
            "Operation succesfull"
        );
    }

    register = async (res: Response, req: Request) => {

    }
}