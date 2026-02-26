import { BaseModel } from "@/common/models/base.model";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { BusinessTypeEnum } from "@/enums/BusinessTypeEnum";

export interface landLordAtributes extends BaseModel {
    userId: string;
    companyName?: string;
    businessType: BusinessTypeEnum
    registrationNumber: string;
    taxId: string;
    phonePrimary: string;
    phoneSecondary?: string;
    address: string;
    city?: string;
    country?: string;
    isVerified: boolean;
    deletedAt?: Date | null;
}

//l'id est optionnel parceque Sequelize génère le UUID automatiquement
export interface landLordCreationAtributes extends Optional<
    landLordAtributes,
    "id" | "companyName" | "phoneSecondary" | "city" | "country"
> {
}

class LandLord
    extends Model<landLordAtributes, landLordCreationAtributes>
    implements landLordAtributes {
        declare id: string;
        declare userId: string;
        declare businessType: BusinessTypeEnum
        declare taxId: string;
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
        declare deletedAt: Date | null;
        static associate(models: any) {
            LandLord.belongsTo(models.User, { 
                foreignKey: 'userId', 
                as: 'users' 
            });
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
            taxId:{
                type: DataTypes.STRING,
                allowNull: false,
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
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null,
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
        {sequelize, modelName: "landLord", tableName: "landlords", timestamps: true, underscored: true},
    );
};

export {LandLord, initModelandLord}