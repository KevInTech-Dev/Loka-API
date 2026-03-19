import {BaseModel} from "@/common/models/base.model";
import {MeterTypeEnum} from "@/enums/MeterTypeEnum";
import {DataTypes, Model, Optional, Sequelize} from "sequelize";

export interface MeterReadingAttributs extends BaseModel {
    landlord_id: string;
    property_id: string;
    unit_id: string;
    tenant_id: string;
    meter_type: MeterTypeEnum;
    reading_date: Date;
    meter_value: number;
    previous_meter_value: number;
    consumption: number;
    rate_per_unit: number;
    amount_due: number;
    recorded_by_user_id: string;
    is_verified: boolean;
}

export interface CreationMeterReadingAttributs extends Optional<MeterReadingAttributs, "id" | "createdAt" | "updatedAt" > {}

class MeterReading
    extends Model<MeterReadingAttributs, CreationMeterReadingAttributs>
    implements MeterReadingAttributs {
        declare id: string;
        declare landlord_id: string;
        declare property_id: string;
        declare unit_id: string;
        declare tenant_id: string;
        declare meter_type: MeterTypeEnum;
        declare reading_date: Date;
        declare meter_value: number;
        declare previous_meter_value: number;
        declare consumption: number;
        declare rate_per_unit: number;
        declare amount_due: number;
        declare recorded_by_user_id: string;
        declare is_verified: boolean;
        declare readonly createdAt?: Date;
        declare readonly updatedAt?: Date;
        static associate(models: any){
            MeterReading.belongsTo(models.LandLord, {
                foreignKey: 'landlord_id',
                as: 'meterReadingLandlord'
            });
            MeterReading.belongsTo(models.Tenant, {
                foreignKey: 'tenant_id',
                as: 'meterReadingTenant'
            });
            MeterReading.belongsTo(models.Property, {
                foreignKey: 'property_id',
                as: 'meterReadingProperty'
            });
            MeterReading.belongsTo(models.UnitLocation, {
                foreignKey: 'unit_id',
                as: 'meterReadingUnit'
            });
        }
    }

const initModelMeterReading = (sequelize: Sequelize) => {
    MeterReading.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            landlord_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                  model: 'landlords',
                  key: 'id',
                },
                onDelete: 'CASCADE',
            },
            property_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                  model: 'property',
                  key: 'id',
                },
                onDelete: 'CASCADE',
            },
            unit_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                  model: 'unitLocation',
                  key: 'id',
                },
                onDelete: 'CASCADE',
            },
            tenant_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                  model: 'tenants',
                  key: 'id',
                },
                onDelete: 'CASCADE',
            },
            meter_type: {
                type: DataTypes.ENUM(...Object.values(MeterTypeEnum)),
                allowNull: false,
            },
            reading_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            meter_value: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            previous_meter_value: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            consumption: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            rate_per_unit: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            amount_due: {
                type: DataTypes.INTEGER,
                allowNull:false,
            },
            recorded_by_user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            is_verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
        },
        { sequelize, modelName: 'MeterReading', tableName: 'meterReadings', timestamps: true, underscored: true, paranoid: true },
    );
};

export { MeterReading, initModelMeterReading };