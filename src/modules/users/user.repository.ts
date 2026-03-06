import { User, UserAttributes, UserCreationAttributes } from "@database/models/Users";
import { CreationAttributes, ModelStatic } from "sequelize";
import { WhereQueryUser } from "@modules/users/user.types";
import { BaseRepositoryImpl } from "@common/base.repository";

export class UserRepository extends BaseRepositoryImpl<User> {


    constructor() {
        super(User);

    }



    create(data: CreationAttributes<User>): Promise<User> {
        return this.model.create(data);
    }

    async findById(id: string) {
        return this.model.findByPk(id);
    }


    async getUserPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.model.findAll({ offset, limit });
    }

    getUserByAttribut(attribut: keyof UserAttributes, value: string) {
        return this.model.findOne({
            where: {
                [attribut]: value
            }
        });
    }


    getUserByMutipleAttributs(attribut: WhereQueryUser) {
        return this.model.findOne({
            where: {
                ...attribut
            }
        })
    }

}