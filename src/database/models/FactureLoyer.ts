import { BaseModel } from "@/common/models/base.model";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface FactureLoyerAttributes extends BaseModel {
    
    unitLocation: string;
    idTenant: string;
    prixLoyer: number;
}

export interface FactureLoyerCreationAttributes extends Optional<
    FactureLoyerAttributes,
    "id" | "createdAt" | "updatedAt"
> { }

class FactureLoyer extends Model<FactureLoyerAttributes, FactureLoyerCreationAttributes>
    implements FactureLoyerAttributes {

    declare id: string;
    declare unitLocation: string;
    declare idTenant: string;
    declare prixLoyer: number;

    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
}

const initModelFactureLoyer = (sequelize: Sequelize) => {
    FactureLoyer.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },

            unitLocation: {
                type: DataTypes.UUID,
                allowNull: false
            },

            idTenant: {
                type: DataTypes.UUID,
                allowNull: false
            },

            prixLoyer: {
                type: DataTypes.DECIMAL,
                allowNull: false
            }

        },
        {
            sequelize,
            tableName: "factures_loyer",
            modelName: "FactureLoyer",
            timestamps: true,
            underscored: true
        }
    );
};

export { FactureLoyer, initModelFactureLoyer };