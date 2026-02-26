import { BaseModel } from "@/common/models/base.model";
import { UnitStatusEnum } from "@/enums/UnitStatusEnum";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Json } from "sequelize/lib/utils";

export interface UnitLocationAttributes extends BaseModel {
    unitTypeId: string;
    unitNumber: string;
    unitName: string;
    floor: number;
    surfaceArea: number;
    isFurnished: Boolean,
    amenities: Json,
    electricityMeterId: string;
    waterMeterId: string;
    initialElectricityReading: number;
    initialWaterReading: number;
    monthlyRent: number;
    electricityIncluded: Boolean;
    waterIncluded: Boolean;
    unitStatus: UnitStatusEnum;
    description: string;
}

export interface UnitLocationCreationAttributes extends Optional<UnitLocationAttributes, "id" | "createdAt" | "updatedAt" | "amenities"> { }

class UnitLocation extends Model<UnitLocationAttributes, UnitLocationCreationAttributes> implements UnitLocationAttributes {
    declare unitTypeId: string;
    declare unitNumber: string;
    declare unitName: string;
    declare floor: number;
    declare surfaceArea: number;
    declare isFurnished: Boolean;
    declare amenities: Json;
    declare electricityMeterId: string;
    declare waterMeterId: string;
    declare initialElectricityReading: number;
    declare initialWaterReading: number;
    declare monthlyRent: number;
    declare electricityIncluded: Boolean;
    declare waterIncluded: Boolean;
    declare unitStatus: UnitStatusEnum;
    declare description: string;
    declare id: string;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
    //Association avec la classe UnitType
    static associate(models: any) {
        UnitLocation.belongsTo(models.unitType, {
            foreignKey: 'unitTypeId',
            as: 'unitType'
        });
    }

}

const initUnitLocation = (sequelize: Sequelize) => {
    UnitLocation.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        unitTypeId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        unitName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        unitNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        floor: {
            type: DataTypes.STRING,
            allowNull: false
        },
        surfaceArea: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        isFurnished: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        amenities: {
            type: DataTypes.JSON,
            allowNull: true
        },
        electricityMeterId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        waterMeterId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        initialElectricityReading: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        initialWaterReading: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        monthlyRent: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        electricityIncluded: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        waterIncluded: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        unitStatus: {
            type: DataTypes.ENUM(...Object.values(UnitStatusEnum)),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        sequelize, modelName: "UnitLocation", tableName: 'unitLocation', timestamps: true, underscored: true, paranoid: true
    })
}

export { UnitLocation, initUnitLocation }