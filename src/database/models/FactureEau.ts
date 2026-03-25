import { FactureAttributes, FactureCreationAttributes } from "@database/models/Facture";
import { DataTypes, Model, Sequelize } from "sequelize";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { StatusFactures } from "@/enums/StatusFacturesEnum";

export interface FactureEauAttributes extends FactureAttributes {

    unitLocation: string;
    idTenant: string;
    idReleveCompteur: string;
}

export interface FactureEauCreationAttributes extends FactureCreationAttributes { }

class FactureEau extends Model<FactureEauAttributes, FactureEauCreationAttributes> implements FactureEauAttributes {

    declare dateEcheance: Date;
    declare dateEmission: Date;
    declare id: string;
    declare idReleveCompteur: string;
    declare idTenant: string;
    declare invoiceType: InvoiceType;
    declare isTva: boolean;
    declare notes: string;
    declare numeroFacture: string;
    declare status: StatusFactures;
    declare totalAPayer: number;
    declare unitLocation: string;
    declare readonly updatedAt?: Date;
    declare readonly createdAt?: Date;

    static associate(models: any) {
        FactureEau.hasOne(models.Payment, {
            foreignKey: 'facture_water_id',
            as: 'Payment'
        });
    }

}

const initModelFactureEau = (sequelize: Sequelize) => {
    FactureEau.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            dateEcheance: {
                type: DataTypes.DATE,
                allowNull: false
            },
            dateEmission: {
                type: DataTypes.DATE,
                allowNull: false
            },
            idReleveCompteur: {
                type: DataTypes.UUID,
                allowNull: false
            },
            idTenant: {
                type: DataTypes.UUID,
                allowNull: false
            },
            invoiceType: {
                type: DataTypes.ENUM(...Object.values(InvoiceType)),
                allowNull: false
            },
            isTva: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            notes: {
                type: DataTypes.STRING,
                allowNull: false
            },
            numeroFacture: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM(...Object.values(StatusFactures)),
                allowNull: false
            },
            totalAPayer: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            unitLocation: {
                type: DataTypes.UUID,
                allowNull: false
            }
        }, {
        sequelize,
        modelName: "FactureEau",
        tableName: "facturesEau",
        timestamps: true,
        underscored: true,
        paranoid: true
    }
    );
}

export { FactureEau, initModelFactureEau }