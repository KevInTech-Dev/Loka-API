import { AuthenticationError, NotFoundError } from "@/common/errors";
import { notFoundHandler } from "../middleware/error.middleware";
import { LoginInput } from "./auth.schema";
import { UserRepository } from "@/modules/users/user.repository";
import { compareHash } from "@/utils/password.utils";
import { TokenService } from "./token.service";
import { TokenResponse } from "./auth.type";

export class AuthService {

    private readonly userRepository: UserRepository;
    private readonly tokenService: TokenService;

    constructor() {
        this.userRepository = new UserRepository();
        this.tokenService = new TokenService()
    }

    login = async (param: LoginInput): Promise<TokenResponse> => {
        const existingUser = await this.userRepository.getUserByAttribut("username", param.username);
        if (!existingUser) {
            throw new NotFoundError("User");
        }
        const verifyPassword = compareHash(existingUser.password, param.password);
        if (verifyPassword) {
            throw new AuthenticationError("Incorrect password")
        }

        return {
            accessToken: this.tokenService.generateSessionToken(existingUser),
            refreshToken: this.tokenService.generateRefreshToken(existingUser)
        }

    }

    register = async () => {

    }
}