import { sendSuccess } from "@/common/api.response";
import { LoginInput } from "./auth.schema"
import { AuthService } from "./login.service";

import { Request, Response } from 'express'
import { CreateUserInput } from "../users/user.schema";

export class AuthController {

    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }


    login = async (req: Request, res: Response) => {
        console.log(req.body);
        sendSuccess(
            res,
            await this.authService.login(req.body as LoginInput),
            "Operation succesfull"
        );
    }

    register = async (req: Request, res: Response) => {
        const dataRegister: CreateUserInput = { ...req.body, photo: req?.file?.path ?? null, role: "proprietaire" };
        const data = await this.authService.register(dataRegister)
        return sendSuccess(
            res,
            data,
            'Operation succesfull'
        );
    }
}