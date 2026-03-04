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

    async getRefreshTokenById(id: string) {
        return await this.refreshToken.findByPk(id);
    }

    async getAllRefreshToken(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.refreshToken.findAndCountAll({ offset, limit });
    }

    async destroyRefreshToken(id: string) {
        const refreshToken = await this.getRefreshTokenById(id);
        if (!refreshToken) {
            return false;
        }
        await refreshToken.destroy();
        return true;
    }
}