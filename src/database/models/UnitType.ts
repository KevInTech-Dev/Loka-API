import { BaseModel } from "@/common/models/base.model";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface UnitTypeAttributes extends BaseModel {
    code: string,
    label: string,
    isActive: Boolean,
}

export interface UnitTypeCreationAttributes extends Optional<UnitTypeAttributes, "id" | "createdAt" | "updatedAt"> { }

class UnitType extends Model<UnitTypeAttributes, UnitTypeCreationAttributes> implements UnitTypeAttributes {
    declare code: string;
    declare label: string;
    declare isActive: Boolean;
    declare id: string;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
    static associate(models: any) {
        UnitType.hasMany(models.unitLocation, {
            foreignKey: 'unitTypeId',
            as: 'unitLocation'
        });
    }
}

const initUnitType = (sequelize: Sequelize) => {
    UnitType.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        label: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    },
        { sequelize, modelName: "UnitType", tableName: 'unitType', timestamps: true, underscored: true, paranoid: true }
    )
}

export { UnitType, initUnitType }
