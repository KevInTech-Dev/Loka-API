import { BaseModel } from "@/common/models/base.model";
import { GenderEnum } from "@/enums/GenderEnum";
import { idCardTypeEnum } from "@/enums/idCardTypeEnum";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { object } from "zod";

export interface TenantAttributes extends BaseModel {
    userId: string;
    date_of_birth : Date;
    gender: GenderEnum;
    nationality: string;
    phone_primary: string;
    phone_secondary?: string;
    id_card_type: idCardTypeEnum;
    id_card_number: string;
    id_card_front_url?: string;
    id_card_back_url?: string;
    occupation?: string;
    employer_name?: string;
    employer_contact?: string;
    emergency_contact_name? : string;
    emergency_contact_phone?: string;
    emergency_contact_relationship?: string;
}

export interface TenantCreationAttributes extends Optional<
    TenantAttributes,
    "id" | "phone_secondary" | "occupation" | "employer_name" | "employer_contact" | "emergency_contact_name" | "emergency_contact_phone" | "emergency_contact_relationship"
> {
}

class Tenant 
    extends Model<TenantAttributes, TenantCreationAttributes>
    implements TenantAttributes {
        declare id: string;
        declare userId: string;
        declare date_of_birth: Date;
        declare gender: GenderEnum;
        declare nationality: string;
        declare phone_primary: string;
        declare phone_secondary?: string;
        declare id_card_type: idCardTypeEnum;
        declare id_card_number: string;
        declare id_card_front_url?: string
        declare id_card_back_url?: string;
        declare occupation?: string;
        declare employer_name?: string;
        declare employer_contact?: string;
        declare emergency_contact_name?: string;
        declare emergency_contact_phone?: string;
        declare emergenc_contact_relationship?: string;
        declare readonly createdAt: Date;
        declare readonly updatedAt: Date;
        static associate(models: any) {
            Tenant.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'users'
            });
        }
    }
    
    const initModelTenant = (sequelize: Sequelize) =>{
        Tenant.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                userId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: "users",
                        key: "id"
                    },
                    onDelete: "CASCADE"
                },
                date_of_birth: {
                    type: DataTypes.DATEONLY,
                    allowNull: false,
                },
                gender: {
                    type: DataTypes.ENUM(...Object.values(GenderEnum)),
                    allowNull: false,
                    defaultValue: GenderEnum.MASCULIN,
                },
                nationality: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                phone_primary: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
                },
                phone_secondary: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    unique: true,
                },
                id_card_type: {
                    type: DataTypes.ENUM(...Object.values(idCardTypeEnum)),
                    allowNull: false
                },
                id_card_number: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                id_card_front_url: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                id_card_back_url: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                occupation: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                employer_name: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                employer_contact: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                emergency_contact_name: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                emergency_contact_phone: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                emergency_contact_relationship: {
                    type: DataTypes.STRING,
                    allowNull: true
                }
            },
            {sequelize, modelName: "Tenant", tableName: "tenants", timestamps: true, underscored: true, paranoid:true},
        );
    };

    export {Tenant, initModelTenant}