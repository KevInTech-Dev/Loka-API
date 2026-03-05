import env from "@/config/env";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RefreshTokenRepository } from "./refreshToken.repository";
import { UserAttributes } from "@/database/models/Users";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto'
import { NotFoundError } from "@/common/errors";
import { UserRepository } from "../users/user.repository";
import { TokenResponse } from "./auth.type";
import { RefreshTokenAttributes } from "@/database/models/RefreshToken";
import { PaginatedResult } from "@/common/paginatedResult";

export class TokenService {

    private readonly refreshTokenRepository: RefreshTokenRepository;
    private readonly userRepository: UserRepository;

    constructor() {
        this.refreshTokenRepository = new RefreshTokenRepository();
        this.userRepository = new UserRepository()
    }

    generateSessionToken(user: UserAttributes): string {
        return jwt.sign(
            { userId: user.id, role: user.role, phoneNumber: user.phoneNumber, username: user.username }, process.env.JWT_SECRET as string, { expiresIn: env.ACCESS_TOKEN_EXPRIRY_TIME });
    }

    generateRefreshToken(user: UserAttributes): string {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        const refreshToken = uuidv4();
        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        this.refreshTokenRepository.createRefreshToken({
            token: tokenHash,
            userId: user.id,
            expiryDate: expiryDate
        });
        return refreshToken;
    }

    getAllRefreshToken = async (page: number, limit: number): Promise<PaginatedResult<RefreshTokenAttributes>> => {
        const { rows, count } = await this.refreshTokenRepository.getAllRefreshToken(page, limit);
        const mappedData = rows.map((objects) => ({
            id: objects.id,
            userId: objects.userId,
            token: objects.token,
            expiryDate: objects.expiryDate,
            createdAt: objects.createdAt,
            updatedAt: objects.updatedAt,
        }))
        return {
            data: mappedData,
            total: count
        }
    }

    verifyToken = (token: string): JwtPayload | null => {
        try {
            return jwt.verify(token, env.JWT_SECRET) as JwtPayload
        } catch (error) {
            throw Error("Incorrect token")
        }
    }

    verifyRefreshToken = async (id: string): Promise<TokenResponse> => {
        const isTokenExisting = await this.refreshTokenRepository.getRefreshTokenById(id);
        if (!isTokenExisting) {
            throw new NotFoundError("This token");
        }
        const date = new Date();
        if (date > isTokenExisting.expiryDate) {
            await this.refreshTokenRepository.destroyRefreshToken(id);
            throw new Error("Token expired")
        }

        const userToAssociate = await this.userRepository.getUserById(isTokenExisting.userId);
        if (!userToAssociate) {
            throw new NotFoundError("This user was")
        }

        await this.refreshTokenRepository.destroyRefreshToken(id);

        return {
            accessToken: this.generateSessionToken(userToAssociate),
            refreshToken: this.generateRefreshToken(userToAssociate)
        }
    }
}