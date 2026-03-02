import { User, UserAttributes, UserCreationAttributes } from "@database/models/Users";
import { ModelStatic } from "sequelize";
import { WhereQueryUser } from "@modules/users/user.types";

export class UserRepository {
    private user: ModelStatic<User>

    constructor() {
        this.user = User;
    }

    async createUser(data: UserCreationAttributes) {
        return await this.user.create(data);
    }

    async getUserById(id: string) {
        return this.user.findByPk(id);
    }


    async getUserPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.user.findAll({ offset, limit });
    }

    async updateUser(id: string, data: Partial<UserCreationAttributes>) {
        const user = await this.getUserById(id);
        if (!user) return null;

        await user.update(data);
        return user;
    }

    async deleteUser(id: string) {
        const user = await this.getUserById(id);
        if (!user) return false;

        await user.destroy();
        return true;
    }

    getUserByAttribut(attribut: keyof UserAttributes, value: string) {
        return this.user.findOne({
            where: {
                [attribut]: value
            }
        });
    }


    getUserByMutipleAttributs(attribut: WhereQueryUser) {

        return this.user.findOne({
            where: {
                ...attribut
            }
        })
    }
}