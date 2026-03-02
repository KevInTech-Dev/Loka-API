import { RefreshToken, RefreshTokenCreationAttribute } from "@/database/models/RefreshToken";
import { ModelStatic } from "sequelize";

export class RefreshTokenRepository {
    private refreshToken: ModelStatic<RefreshToken>

    constructor() {
        this.refreshToken = RefreshToken;
    }

    async createRefreshToken(data: RefreshTokenCreationAttribute) {
        return this.refreshToken.create(data);
    }
}