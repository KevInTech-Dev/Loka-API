import { BaseModel } from "@/common/models/base.model";
import { CategoryMaintenanceRequest } from "@/enums/CategoryMaintenanceRequest";
import { Priority } from "@/enums/Priority";
import { StatutMaintenanceRequest } from "@/enums/StatutMaintenanceRequest";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface MaintenanceAttributes extends BaseModel {
    id: string;
    titre: string;
    locataireId: string;
    categorie: CategoryMaintenanceRequest;
    priority: Priority;
    responsable: string;
    date: Date;
    statut: StatutMaintenanceRequest;

}

export interface CreateMaintenanceAttributes extends Optional<MaintenanceAttributes, "id" | "createdAt" | "updatedAt" | "responsable" | "statut" | "date"> { }
class Maintenance extends Model<MaintenanceAttributes, CreateMaintenanceAttributes> implements MaintenanceAttributes {
    declare id: string;
    declare titre: string;
    declare locataireId: string;
    declare categorie: CategoryMaintenanceRequest;
    declare priority: Priority;
    declare responsable: string;
    declare date: Date;
    declare statut: StatutMaintenanceRequest;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
}

const initMaintenance = (sequelize: Sequelize) => {
    Maintenance.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        titre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        locataireId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        categorie: {
            type: DataTypes.ENUM(...Object.values(CategoryMaintenanceRequest)),
            allowNull: false
        },
        priority: {
            type: DataTypes.ENUM(...Object.values(Priority)),
            allowNull: true

        },
        responsable: {
            type: DataTypes.UUID,
            allowNull: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false

        },
        statut: {
            type: DataTypes.ENUM(...Object.values(StatutMaintenanceRequest)),
            allowNull: false
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
    Maintenance,
    initMaintenance
}