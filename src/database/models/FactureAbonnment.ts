import {DataTypes, Model, Optional, Sequelize} from "sequelize";
import {FactureAttributes} from "@database/models/Facture";
import {InvoiceType} from "@/enums/InvoiceTypeEnume";
import {StatusFactures} from "@/enums/StatusFacturesEnum";

export interface FactureAbonnementAttributes extends FactureAttributes {
    landlordId: string;
    utilisateurAbonnement: string;
    totalAPayer: number;
}

export interface FactureAbonnementCreationAttributes extends Optional<FactureAbonnementAttributes,"id"|"createdAt"|"updatedAt">{}

class FactureAbonnement extends Model<FactureAbonnementAttributes,FactureAbonnementCreationAttributes> implements FactureAbonnementAttributes{

    declare landlordId: string;
    declare totalAPayer: number;
    declare utilisateurAbonnement: string;
    declare dateEcheance: Date;
    declare dateEmission: Date;
    declare id: string;
    declare invoiceType: InvoiceType;
    declare isTva: boolean;
    declare numeroFacture: string;
    declare status: StatusFactures;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
}

const initModelFactureAbonnement = (sequelize:Sequelize) => {
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
            totalAPayer: {},
            utilisateurAbonnement: {},
            dateEcheance: {},
            dateEmission: {},
            invoiceType: {},
            isTva: {},
            numeroFacture: {},
            status: {}
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

export{FactureAbonnement,initModelFactureAbonnement}

