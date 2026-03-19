import {DataTypes, Model, Sequelize} from "sequelize";
import {FactureAttributes, FactureCreationAttributes} from "@database/models/Facture";
import {InvoiceType} from "@/enums/InvoiceTypeEnume";
import {StatusFactures} from "@/enums/StatusFacturesEnum";

export interface FactureAbonnementAttributes extends FactureAttributes {
    landlordId: string;
    utilisateurAbonnement: string;
}

export interface FactureAbonnementCreationAttributes extends FactureCreationAttributes{}

class FactureAbonnement extends Model<FactureAbonnementAttributes, FactureAbonnementCreationAttributes> implements FactureAbonnementAttributes {

    declare landlordId: string;
    declare totalAPayer: number;
    declare utilisateurAbonnement: string;
    declare dateEcheance: Date;
    declare dateEmission: Date;
    declare notes: string;
    declare id: string;
    declare invoiceType: InvoiceType;
    declare isTva: boolean;
    declare numeroFacture: string;
    declare status: StatusFactures;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
}

const initModelFactureAbonnement = (sequelize: Sequelize) => {
    FactureAbonnement.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            landlordId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            totalAPayer: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            utilisateurAbonnement: {
                type: DataTypes.UUID,
                allowNull: false
            },
            dateEcheance: {
                type: DataTypes.DATE,
                allowNull: false
            },
            dateEmission: {
                type: DataTypes.DATE,
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
            numeroFacture: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM(...Object.values(StatusFactures)),
                allowNull: false
            },
            notes: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "FactureAbonnement",
            tableName: "facturesAbonnement",
            timestamps: true,
            underscored: true,
            paranoid: true
        }
    );
};

export { FactureAbonnement, initModelFactureAbonnement }

