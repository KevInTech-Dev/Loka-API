import {BaseModel} from "@/common/models/base.model";
import {DataTypes, Model, Optional, Sequelize} from "sequelize";

export interface TechnicalManagerAttributes extends BaseModel {
    title: string,
    name: string,
    contact: string
}

export interface CreateTechnicalMangerAttributes extends Optional<TechnicalManagerAttributes, "id" | "createdAt" | "updatedAt"> { }
class TechnicalManager extends Model<TechnicalManagerAttributes, CreateTechnicalMangerAttributes> implements TechnicalManagerAttributes {
    declare id: string;
    declare title: string;
    declare name: string;
    declare contact: string;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
}

const initTechnicalManager = (sequelize: Sequelize) => {
    TechnicalManager.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contact: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: "TechnicalManger",
        tableName: 'technicalManger',
        timestamps: true,
        underscored: true,
        paranoid: true
    })
}

export {
    initTechnicalManager,
    TechnicalManager
}