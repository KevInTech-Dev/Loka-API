import { RefreshToken, RefreshTokenCreationAttribute } from "@/database/models/RefreshToken";
import { ModelStatic } from "sequelize";

export class RefreshTokenRepository {
    private refreshToken: ModelStatic<RefreshToken>

    constructor() {
        this.refreshToken = this.refreshToken;
    }

    async createRefreshToken(data: RefreshTokenCreationAttribute) {
        return this.refreshToken.create(data);
    }
}