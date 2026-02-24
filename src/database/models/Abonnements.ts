import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { PlanAbonnementEnum } from "@/enums/PlanAbonnementEnum";
import { BaseModel } from "@common/models/base.model";


export interface AbonnementAttributes extends BaseModel {
    id: string;
    planAbonnement: PlanAbonnementEnum;
    duree: number; // Durée en mois
    label: string;          
    prix: number;
    detail: string;
    other: JSON;
   
}


export interface AbonnementCreationAttributes 
    extends Optional<AbonnementAttributes, "id" | "createdAt" | "updatedAt"> {}  


class abonnements  
extends Model<AbonnementAttributes, AbonnementCreationAttributes>
    implements AbonnementAttributes {
    
    declare id: string;
    declare planAbonnement: PlanAbonnementEnum;
    duree: number;
    declare label: string;      
    declare prix: number;
    declare detail: string;
    declare other: JSON;
    declare createdAt: Date;
    declare updatedAt: Date;
}


const initModelAbonnement = (sequelize: Sequelize) => {
    abonnements.init(  
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            planAbonnement: {
                type: DataTypes.ENUM(...Object.values(PlanAbonnementEnum)),
                allowNull: false,
                defaultValue: PlanAbonnementEnum.BASIC,
            },
            duree: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            label: {
                type: DataTypes.STRING,
                allowNull: false,  
            },
            prix: {
                type: DataTypes.FLOAT,
                allowNull: false,   
            },
            detail: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            other: {
                type: DataTypes.JSON,
                allowNull: true,
            },
        },
        {
        sequelize,modelName: "Abonnement",tableName: 'abonnements',timestamps: true,
            underscored: true,
        }
    );
};


export { abonnements, initModelAbonnement };
