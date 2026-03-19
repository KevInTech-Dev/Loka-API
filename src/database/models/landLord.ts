import {BaseModel} from "@/common/models/base.model";
import {DataTypes, Model, Optional, Sequelize} from "sequelize";
import {BusinessTypeEnum} from "@/enums/BusinessTypeEnum";

export interface landLordAtributes extends BaseModel {
    userId: string;
    companyName?: string;
    businessType: BusinessTypeEnum
    registrationNumber: string;
    taxId: string;
    creditBalance: number,
    phonePrimary: string;
    phoneSecondary?: string;
    address: string;
    city?: string;
    country?: string;
    isVerified: boolean;
}

//l'id est optionnel parceque Sequelize génère le UUID automatiquement
export interface landLordCreationAtributes extends Optional<
    landLordAtributes,
    "id" | "companyName" | "phoneSecondary" | "city" | "country" | 'creditBalance'
> {
}

class LandLord
    extends Model<landLordAtributes, landLordCreationAtributes>
    implements landLordAtributes {
    declare id: string;
    declare userId: string;
    declare businessType: BusinessTypeEnum
    declare taxId: string;
    declare creditBalance: number;
    declare registrationNumber: string;
    declare companyName: string;
    declare phonePrimary: string;
    declare phoneSecondary: string;
    declare address: string;
    declare city: string;
    declare country: string;
    declare isVerified: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt?: Date;

    static associate(models: any) {
        LandLord.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'landlordUser',
        });
        LandLord.hasMany(models.Contract, {
            foreignKey: 'landlord_id',
            as: 'landlordContract'
        });
        LandLord.hasMany(models.MeterReading, {
            foreignKey: 'landlord_id',
            as: 'landlordMeterReading'
        });
        LandLord.hasMany(models.Payment, {
            foreignKey: 'landlord_id',
            as: 'landlordPaymentPayment'
        })
    }
}

const initModelandLord = (sequelize: Sequelize) => {
    LandLord.init(
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
            companyName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            businessType: {
                type: DataTypes.ENUM(...Object.values(BusinessTypeEnum)),
                allowNull: false,
                defaultValue: BusinessTypeEnum.PARTICULIER,
            },
            taxId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            creditBalance: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            registrationNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phonePrimary: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            phoneSecondary: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isVerified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        },
        {
            sequelize,
            modelName: "LandLord",
            tableName: "landlords",
            timestamps: true,
            underscored: true,
            paranoid: true,
        },
    );
};

export {LandLord, initModelandLord}