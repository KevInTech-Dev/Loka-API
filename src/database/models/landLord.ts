import { BaseModel } from "@/common/models/base.model";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { BusinessTypeEnum } from "@/enums/BusinessTypeEnum";
import { UUID } from "node:crypto";
import { User } from "./Users";

export interface landLordAtributes extends BaseModel {
    // userId: UUID;
    companyName: string;
    businessType: BusinessTypeEnum
    taxId: string;
    registrationNumber: string;
    phonePrimary: string;
    phoneSecondary: string;
    address: string;
    city: string;
    country: string;
    isVerified: boolean;
}

export interface landLordCreationAtributes extends Optional<
    landLordAtributes,
    "id"
> {
}

class landLord
    extends Model<landLordAtributes, landLordCreationAtributes>
    implements landLordAtributes {
        declare id: string;
        // declare userId: string;
        // declare userId: `${string}-${string}-${string}-${string}-${string}`;
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
    }

const initModelandLord = (sequelize: Sequelize) => {
    landLord.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            // userId: {
            //     type: DataTypes.INTEGER,
            //     references: {
            //         model: User,
            //         key: "id"
            //     },
            //     onDelete: "CASCADE"
            // },
            companyName: {
                type: DataTypes.STRING,
                allowNull: false,
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
            phoneSecondary: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
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

export {landLord, initModelandLord}