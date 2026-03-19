import {FactureAttributes, FactureCreationAttributes} from "./Facture";
import {DataTypes, Model, Sequelize} from "sequelize";
import {InvoiceType} from "@/enums/InvoiceTypeEnume";
import {StatusFactures} from "@/enums/StatusFacturesEnum";

export interface FactureMaintenanceAttributes extends FactureAttributes {
    unitLocation: string;
    idTenant: string;
    maintenanceId: string;
}

export interface FactureMaintenanceCreationAttributes extends FactureCreationAttributes{}

class FactureMaintenance extends Model<FactureMaintenanceAttributes, FactureMaintenanceCreationAttributes> implements FactureMaintenanceAttributes {
    declare readonly createdAt?: Date;
    declare dateEcheance: Date;
    declare dateEmission: Date;
    declare id: string;
    declare idTenant: string;
    declare invoiceType: InvoiceType;
    declare isTva: boolean;
    declare maintenanceId: string;
    declare notes: string;
    declare numeroFacture: string;
    declare totalAPayer: number;
    declare status: StatusFactures;
    declare unitLocation: string;
    declare readonly updatedAt?: Date;

    static associate(models: any) {
        FactureMaintenance.hasOne(models.Payment, {
            foreignKey: 'facture_mtn_id',
            as: 'Payment'
        });
    }

}

const initModelFactureMiantenance = (sequelize: Sequelize) => {
    FactureMaintenance.init({
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
        maintenanceId: {
            type: DataTypes.UUID,
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
        unitLocation: {
            type: DataTypes.UUID,
            allowNull: false
        },
        totalAPayer: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'FactureMaintenance',
        modelName: 'factureMaintenance',
        timestamps: true,
        underscored: true,
        paranoid: true
    });
}

export { FactureMaintenance, initModelFactureMiantenance }