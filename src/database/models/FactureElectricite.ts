import { FactureAttributes, FactureCreationAttributes } from "@database/models/Facture";
import { DataTypes, Model, Sequelize } from "sequelize";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { StatusFactures } from "@/enums/StatusFacturesEnum";

export interface FactureElectriciteAttributes extends FactureAttributes {
    unitLocation: string;
    idTenant: string;
    idReleveCompteur: string;
}

export interface FactureElectriciteCreationAttributes extends FactureCreationAttributes { }

class FactureElectricite extends Model<FactureElectriciteAttributes, FactureElectriciteCreationAttributes> implements FactureElectriciteAttributes {
    declare readonly createdAt?: Date;
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
    static associate(models: any) {
        FactureElectricite.hasOne(models.Payment, {
            foreignKey: 'facture_elec_id',
            as: 'Payment'
        });
    }

}

const initModelFactureElectricite = (sequelize: Sequelize) => {
    FactureElectricite.init(
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
                type: DataTypes.UUID,
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
        tableName: 'FactureElectricite',
        modelName: 'factureElectricite',
        paranoid: true,
        timestamps: true,
        underscored: true,
    })
}

export { FactureElectricite, initModelFactureElectricite };
