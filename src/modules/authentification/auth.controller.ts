import { sendPaginated, sendSuccess } from "@/common/api.response";
import { LoginInput } from "./auth.schema"
import { AuthService } from "./login.service";

import { Request, Response } from 'express'
import { CreateUserInput } from "../users/user.schema";
import { TokenService } from "./token.service";
import { RefreshTokenAttributes } from "@/database/models/RefreshToken";
import { RoleEnum } from "@/enums/RoleEnum";

export class AuthController {

    private readonly authService: AuthService;
    private readonly tokenService: TokenService

    constructor() {
        this.authService = new AuthService();
        this.tokenService = new TokenService()
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
        const dataRegister: CreateUserInput = { ...req.body, photo: req?.file?.path ?? null, role: RoleEnum.PROPRIETAIRE };
        const data = await this.authService.register(dataRegister)
        return sendSuccess(
            res,
            data,
            'Operation succesfull'
        );
    }

    refresh = async (req: Request, res: Response) => {
        const data = await this.tokenService.verifyRefreshToken(req.params.id as string);
        return sendSuccess(
            res,
            data,
            "Operation succesfull"
        )
    }

    getAllRefreshToken = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const { data, total } = await this.tokenService.getAllRefreshToken(page, limit);
        return sendPaginated(
            res,
            data,
            limit,
            page,
            total
        );
    }
}