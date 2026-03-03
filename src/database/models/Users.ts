import {DataTypes, Model, Optional, Sequelize} from "sequelize";
import {RoleEnum} from "@/enums/RoleEnum";
import {BaseModel} from "@common/models/base.model";


export interface UserAttributes extends BaseModel {
    username: string;
    firstname?: string;
    lastname?: string;
    phoneNumber: string;
    role: RoleEnum
    dateDebutSuspension: Date;
    dateFinSuspension: Date;
    email: string;
    password: string;
    isActive: boolean;
    profilePhotoUrl?: string;
    isEmailVerified: boolean;
}

export interface UserCreationAttributes extends Optional<
    UserAttributes,
    "id" | "firstname" | "lastname" | "profilePhotoUrl" | "createdAt" | "updatedAt"

> {
}

class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    declare id: string;
    declare email: string;
    declare username: string;
    declare password: string;
    declare firstname?: string;
    declare lastname?: string;
    declare phoneNumber: string;
    declare role: RoleEnum
    declare dateDebutSuspension: Date;
    declare dateFinSuspension: Date;
    declare isActive: boolean;
    declare profilePhotoUrl?: string;
    declare isEmailVerified: boolean;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
    //J'ai ajouté l'association qui est entre landlord et user avec la méthode associate()
    static associate(models: any) {
        User.hasOne(models.landLord, {
            foreignKey: 'userId',
            as: 'landlord'
        });
        User.hasOne(models.Tenant, {
            foreignKey: 'userId',
            as: 'tenant'
        });
        User.hasMany(models.RefreshToken, {
            foreignKey: 'userId',
            as: 'refreshToken'
        })
    }
}

const initModelUser = (sequelize: Sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            }, firstname: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: true
            },
            lastname: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            role: {
                type: DataTypes.ENUM(...Object.values(RoleEnum)),
                allowNull: false,
                defaultValue: RoleEnum.LOCATAIRE,
            },
            dateDebutSuspension: {
                type: DataTypes.DATE(),
                allowNull: false,
            },
            dateFinSuspension: {
                type: DataTypes.DATE(),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            profilePhotoUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            isEmailVerified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        },
        {sequelize, modelName: "User", tableName: 'users', timestamps: true, underscored: true, paranoid: true,},
    );
};

export { User, initModelUser };
