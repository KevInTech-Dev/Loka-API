import { BaseRepositoryImpl } from "@/common/base.repository";
import { PermissionsAbonnement, permissionsAbonnementAttributes } from "@/database/models/PermissionsAbonnement";
import { Permissions } from "@/database/models/Permissions";
import { CreationAttributes } from "sequelize";
import { WhereQueryPermissions } from "../Permissions/permissions.type";

export class PermissionsAbonnementRepository extends BaseRepositoryImpl<PermissionsAbonnement> {

    constructor() {
        super(PermissionsAbonnement);
    }

    create(data: CreationAttributes<PermissionsAbonnement>): Promise<PermissionsAbonnement> {
        return this.model.create(data);
    }

    async findById(id: string) {
        return this.model.findByPk(id);
    }


    async getPermissionsAbonnementPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.model.findAll({ offset, limit });
    }

    getPermissionsAbonnementByAttribut(attribut: keyof permissionsAbonnementAttributes, value: string) {
        return this.model.findOne({
            where: {
                [attribut]: value
            }
        });
    }


    getPermissionsAbonnementByMutipleAttributs(attribut: WhereQueryPermissions) {
        return this.model.findOne({
            where: {
                ...attribut
            }
        })
    }


    getAbonnementPermisson(abonnementId: string) {
        return this.model.findOne(
            {
                where: {
                    idAbonnement: abonnementId
                },
                include: [
                    {
                        model: Permissions,
                        as: 'permission'
                    }
                ]
            }
        )
    }
}