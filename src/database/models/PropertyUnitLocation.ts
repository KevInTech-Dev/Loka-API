import {BaseModel} from "@/common/models/base.model";
import {DataTypes, Model, Optional, Sequelize} from "sequelize";

export interface PropertyUnitLocationAttributes extends BaseModel {
    unitLocationId: string;
    propertyId: string;
}

export interface PropertyUnitLocationCreationAttributes extends Optional<PropertyUnitLocationAttributes, "id" | "createdAt" | "updatedAt"> { }

class PropertyUnitLocation extends Model<PropertyUnitLocationAttributes, PropertyUnitLocationCreationAttributes> implements PropertyUnitLocationAttributes {
    declare unitLocationId: string;
    declare propertyId: string;
    declare id: string;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;

}

const initPropertyUnitLocation = (sequelize: Sequelize) => {
    PropertyUnitLocation.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        unitLocationId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        propertyId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
    }, {
        sequelize, modelName: "PropertyUnitLocation", tableName: 'propertyUnitLocation', timestamps: true, underscored: true, paranoid: true
    })
}

export { PropertyUnitLocation, initPropertyUnitLocation }