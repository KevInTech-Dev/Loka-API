import { BaseModel } from "@/common/models/base.model";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface RefreshTokenAttributes extends BaseModel {
    token: string;
    userId: string;
    expiryDate: Date
}

export interface RefreshTokenCreationAttribute extends Optional<RefreshTokenAttributes, "id" | "createdAt" | "updatedAt"> { }

class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttribute> implements RefreshTokenAttributes {
    declare token: string;
    declare userId: string;
    declare expiryDate: Date;
    declare id: string;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
    //Association avec la classe user
    static associate(models: any) {
        RefreshToken.belongsTo(
            models.refreshToken, {
            foreignKey: "userId",
            as: "users"
        }
        )
    }
}

const initRefreshToken = (sequelize: Sequelize) => {
    RefreshToken.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true

        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "users",
                key: "id"
            },
            onDelete: "CASCADE"
        },
        expiryDate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize, modelName: "RefreshToken", tableName: 'refreshToken', timestamps: true, underscored: true, paranoid: true
    })
}

export { RefreshToken, initRefreshToken }