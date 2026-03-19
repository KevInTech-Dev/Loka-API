import {BaseModel} from "@/common/models/base.model";
import {DataTypes, Model, Optional, Sequelize} from "sequelize";

export interface permissionsAbonnementAttributes extends BaseModel {
    idAbonnement: string;
    idPermissions: string;
}

export interface permissionsAbonnementCreationAttributes extends Optional<permissionsAbonnementAttributes, "id" | "createdAt" | "updatedAt"> { }

class PermissionsAbonnement extends Model<permissionsAbonnementAttributes, permissionsAbonnementCreationAttributes> implements permissionsAbonnementAttributes {
    declare id: string;
    declare idAbonnement: string;
    declare idPermissions: string;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
    static associate(models: any) {
        PermissionsAbonnement.belongsTo(models.permissions, {
            foreignKey: "idPermission",
            as: "permission"
        })

        PermissionsAbonnement.belongsTo(models.Utilisateur_Abonnement, {
            foreignKey: "idAbonnement",
            as: "abonnement"
        })
    }
}

const initModelPermissionsAbonnement = (sequelize: Sequelize) => {
    PermissionsAbonnement.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        idAbonnement: {
            type: DataTypes.UUID,
            allowNull: false
        },
        idPermissions: {
            type: DataTypes.UUID,
            allowNull: false
        }

    }, { sequelize, modelName: "permissionsAbonnement", tableName: "PermissionsAbonnement", timestamps: true, underscored: true, paranoid: true, },)
}

export { PermissionsAbonnement, initModelPermissionsAbonnement }