import {BaseModel} from "@/common/models/base.model";
import {DataTypes, Model, Optional, Sequelize} from "sequelize";

export interface PropertyAttribute extends BaseModel {
    label: string;
    type: string;
    address: string;
    city: string;
    district: string;
    country: string;
    numberOfUnits: number;
    numberOfFloors: number;
    yearBuilt: string;
    description: string;
    electricityMeterNumber: string;
    waterMeterNumber: string;
    documents: string;
}

export interface PropertyCreationAttributes extends Optional<PropertyAttribute, "id" | "createdAt" | "updatedAt"> { }

class Property extends Model<PropertyAttribute, PropertyCreationAttributes> implements PropertyAttribute {
    declare label: string;
    declare type: string;
    declare address: string;
    declare city: string;
    declare district: string;
    declare country: string;
    declare numberOfUnits: number;
    declare numberOfFloors: number;
    declare yearBuilt: string;
    declare description: string;
    declare electricityMeterNumber: string;
    declare waterMeterNumber: string;
    declare documents: string;
    declare id: string;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
    static associate(models: any) {
        Property.belongsTo(models.PropertyType, {
            foreignKey: 'propertyTypeId',
            as: 'propertyType'
        });
        Property.hasMany(models.Contract, {
                foreignKey: 'property_id',
                as: 'propertyContract'
            });
        Property.hasMany(models.MeterReading, {
                foreignKey: 'property_id',
                as: 'propertyMeterReading'
            });
    }
}

const initModelProperty = (sequelize: Sequelize) => {
    Property.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            label: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.UUID,
                allowNull: false
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false
            },
            district: {
                type: DataTypes.STRING,
                allowNull: false
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false
            },
            numberOfUnits: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            numberOfFloors: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            yearBuilt: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            electricityMeterNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            waterMeterNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            documents: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, { sequelize, modelName: "Property", tableName: 'property', timestamps: true, underscored: true, paranoid: true },
    )
};

export { Property, initModelProperty };