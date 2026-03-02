import env from "@/config/env";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RefreshTokenRepository } from "./refreshToken.repository";
import { UserAttributes } from "@/database/models/Users";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto'

export class TokenService {

    private readonly refreshTokenRepository: RefreshTokenRepository;

    constructor() {
        this.refreshTokenRepository = new RefreshTokenRepository();
    }

    generateSessionToken(user: UserAttributes): string {
        return jwt.sign(
            { userId: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: env.ACCESS_TOKEN_EXPRIRY_TIME });
    }

    generateRefreshToken(user: UserAttributes): string {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        const refreshToken = uuidv4();
        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        //jwt.sign({ user }, env.JWT_SECRET as string, { expiresIn: env.REFRESH_TOKEN_EXPRIRY_TIME });
        this.refreshTokenRepository.createRefreshToken({
            token: tokenHash,
            userId: user.id,
            expiryDate: expiryDate
        });
        return refreshToken;
    }

    verifyToken = (token: string): JwtPayload | null => {
        try {
            return jwt.verify(token, env.JWT_SECRET) as JwtPayload
        } catch (error) {
            throw Error("Incorrect token")
        }
    }
}