import { BaseModel } from "@/common/models/base.model";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface PropertyTypeAttributes extends BaseModel {
    label: string;
}

export interface PropertyTypeCreationAttributes extends Optional<PropertyTypeAttributes, "id" | "createdAt" | "updatedAt"> { }

class PropertyType extends Model<PropertyTypeAttributes, PropertyTypeCreationAttributes> implements PropertyTypeAttributes {
    declare id: string;
    declare label: string;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
}

const initModelPropertyType = (sequelize: Sequelize) => {
    PropertyType.init(
        {
            id:{
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            label:{
                type: DataTypes.STRING,
                allowNull: false
            },
        },
        { sequelize, modelName: "PropertyType", tableName: 'propertyType', timestamps: true, underscored: true },
    )

};
export {PropertyType, initModelPropertyType};