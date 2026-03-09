import { BaseRepositoryImpl } from "@/common/base.repository";
import { Permissions, permissionsAttributes } from "@/database/models/Permissions";
import { CreationAttributes } from "sequelize";
import { WhereQueryPermissions } from "./permissions.type";

export class PermissionsRepository extends BaseRepositoryImpl<Permissions> {

    constructor() {
        super(Permissions);
    }

    create(data: CreationAttributes<Permissions>): Promise<Permissions> {
        return this.model.create(data);
    }

    async findById(id: string) {
        return this.model.findByPk(id);
    }


    async getPermissionsPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.model.findAll({ offset, limit });
    }

    getPermissionsByAttribut(attribut: keyof permissionsAttributes, value: string) {
        return this.model.findOne({
            where: {
                [attribut]: value
            }
        });
    }


    getPermissionsByMutipleAttributs(attribut: WhereQueryPermissions) {
        return this.model.findOne({
            where: {
                ...attribut
            }
        })
    }
}