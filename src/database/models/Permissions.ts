import { BaseModel } from "@/common/models/base.model";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface permissionsAttributes extends BaseModel {
    id: string;
    titre: string;
    permissions: string;
}

export interface permissionsCreationAttributes extends Optional<permissionsAttributes, "id" | "createdAt" | "updatedAt"> { }

class Permissions extends Model<permissionsAttributes, permissionsCreationAttributes> implements permissionsAttributes {
    declare id: string;
    declare titre: string;
    declare permissions: string;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
    static associate(models: any) {
        Permissions.hasMany(
            models.permissionsAbonnement, {
            foreignKey: "idPermission",
            as: "permission"
        }
        )
    }
}

const initmodelPermissions = (sequelize: Sequelize) => {
    Permissions.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            titre: {
                type: DataTypes.STRING,
                allowNull: false
            },
            permissions: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, { sequelize, modelName: "permissions", tableName: "Permissions", timestamps: true, underscored: true, paranoid: true },
    );
}

export { Permissions, initmodelPermissions }