import { AuthenticationError, DuplicateEntryError, NotFoundError } from "@/common/errors";
import { LoginInput } from "./auth.schema";
import { UserRepository } from "@/modules/users/user.repository";
import { compareHash, hashWord } from "@/utils/password.utils";
import { TokenService } from "./token.service";
import { TokenResponse } from "./auth.type";
import { CreateUserInput } from "../users/user.schema";
import { UserResponse } from "../users/user.types";
import { UserService } from "../users/user.service";
import { triggerAsyncId } from "node:async_hooks";
import { trim } from "zod";

export class AuthService {

    private readonly userService: UserService;
    private readonly userRepository: UserRepository;
    private readonly tokenService: TokenService;

    constructor() {
        this.userService = new UserService();
        this.tokenService = new TokenService();
        this.userRepository = new UserRepository()
    }

    login = async (param: LoginInput): Promise<TokenResponse> => {
        const existingUser = await this.userRepository.getUserByAttribut('username', param.username);
        //console.log("Value of existing user", existingUser);
        if (!existingUser) {
            throw new NotFoundError("User not found");
        }
        const verifyPassword = await compareHash(existingUser.password.trim(), param.password.trim());
        console.log("value of the verifyPassword:", verifyPassword + existingUser.password + param.password);
        if (!verifyPassword) {
            throw new AuthenticationError("Incorrect password");
        }

        return {
            accessToken: this.tokenService.generateSessionToken(existingUser),
            refreshToken: this.tokenService.generateRefreshToken(existingUser)
        }

    }

    register = async (userInformations: CreateUserInput): Promise<UserResponse> => {
        const existingUserName = await this.userRepository.getUserByAttribut('username', userInformations.username);
        if (existingUserName) {
            throw new DuplicateEntryError("User already exist with this username");
        }
        const existingUserEmail = await this.userRepository.getUserByAttribut("email", userInformations.email);
        if (existingUserEmail) {
            throw new DuplicateEntryError("User already exist with this email");
        }

        const user = await this.userService.createUser({
            email: userInformations.email,
            username: userInformations.username,
            phoneNumber: userInformations.phoneNumber,
            password: userInformations.password,
            lastname: userInformations.lastname,
            firstname: userInformations.firstname,
            role: userInformations.role
        });
        return {
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            phoneNumber: user.phoneNumber,
            role: user.role,
            email: user.email,
            isActive: false,
            profilePhotoUrl: user.profilePhotoUrl,
            isEmailVerified: false,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }
}