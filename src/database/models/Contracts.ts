import { BaseModel } from '@/common/models/base.model';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { ContractStatusEnum } from '@/enums/ContractStatusEnum';
import { ContractTypeEnum } from '@/enums/ContractTypeEnum';

export interface ContractAttributes extends BaseModel {
  contract_number: string;
  landlord_id: string;
  property_id: string;
  unit_id: string;
  tenant_id: string;
  landlord_signature_url?: string;
  tenant_signature_url?: string;
  contract_type: ContractTypeEnum;
  contract_start_date: Date;
  contract_end_date: Date;
  monthly_rent: number;
  security_deposit: number;
  deposit_paid: boolean;
  rent_due_day: number;
  late_fee_grace_days: number;
  electricity_included: boolean;
  water_included: boolean;
  electricity_rate_per_kwh: number;
  water_rate_per_m3: number;
  other_charges: JSON;
  initial_electricity_reading: number;
  initial_water_reading: number;
  auto_renewal: boolean;
  special_terms: string;
  contract_status: ContractStatusEnum;
  is_signed_by_landlord: boolean;
  is_signed_by_tenant: boolean;
  nextRentDueDate: Date
}

export interface ContractCreationAttributes extends Optional<
  ContractAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'nextRentDueDate'
> { }

class Contract
  extends Model<ContractAttributes, ContractCreationAttributes>
  implements ContractAttributes {
  declare id: string;
  declare contract_number: string;
  declare landlord_id: string;
  declare property_id: string;
  declare unit_id: string;
  declare tenant_id: string;
  declare contract_type: ContractTypeEnum;
  declare contract_start_date: Date;
  declare contract_end_date: Date;
  declare monthly_rent: number;
  declare security_deposit: number;
  declare deposit_paid: boolean;
  declare rent_due_day: number;
  declare late_fee_grace_days: number;
  declare electricity_included: boolean;
  declare water_included: boolean;
  declare electricity_rate_per_kwh: number;
  declare water_rate_per_m3: number;
  declare other_charges: JSON;
  declare initial_electricity_reading: number;
  declare initial_water_reading: number;
  declare auto_renewal: boolean;
  declare special_terms: string;
  declare landlord_signature_url?: string;
  declare tenant_signature_url?: string;
  declare contract_status: ContractStatusEnum;
  declare is_signed_by_landlord: boolean;
  declare is_signed_by_tenant: boolean;
  declare nextRentDueDate: Date;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
  static associate(models: any) {
    Contract.belongsTo(models.LandLord, {
      foreignKey: 'landlord_id',
      as: 'contractLandlord',
    });
    Contract.belongsTo(models.Tenant, {
      foreignKey: 'tenant_id',
      as: 'contractTenant',
    });
    Contract.belongsTo(models.Property, {
      foreignKey: 'property_id',
      as: 'contractProperty',
    });
    Contract.belongsTo(models.UnitLocation, {
      foreignKey: 'unit_id',
      as: 'contractUnit',
    });
  }
}

const initModelContract = (sequelize: Sequelize) => {
  Contract.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nextRentDueDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      contract_number: {
        type: DataTypes.STRING,
        allowNull: false,
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
      contract_type: {
        type: DataTypes.ENUM(...Object.values(ContractTypeEnum)),
        allowNull: false,
      },
      contract_start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      contract_end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      monthly_rent: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      security_deposit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      deposit_paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rent_due_day: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      late_fee_grace_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      electricity_included: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      water_included: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      electricity_rate_per_kwh: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      water_rate_per_m3: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      other_charges: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      initial_electricity_reading: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      initial_water_reading: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      auto_renewal: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      special_terms: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contract_status: {
        type: DataTypes.ENUM(...Object.values(ContractStatusEnum)),
        defaultValue: ContractStatusEnum.DRAFT,
      },
      tenant_signature_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      landlord_signature_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_signed_by_landlord: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      is_signed_by_tenant: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    { sequelize, modelName: 'Contract', tableName: 'contracts', timestamps: true, underscored: true, paranoid: true },
  );
};

export { Contract, initModelContract };
