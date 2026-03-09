import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { BaseModel } from "@common/models/base.model";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { StatusFactures } from "@/enums/StatusFacturesEnum";


export interface FactureAttributes extends BaseModel {

    numeroFacture: string;
    dateEmission: Date;
    invoiceType: InvoiceType;
    dateEcheance: Date;
    status: StatusFactures;
    totalAPayer: number;
    notes?: string;
    isTva: boolean;
}

export interface FactureCreationAttributes extends Optional<
    FactureAttributes,
    "id" | "notes" | "createdAt" | "updatedAt" | "isTva"
> { }

class Facture
    extends Model<FactureAttributes, FactureCreationAttributes>
    implements FactureAttributes {

    declare id: string;
    declare numeroFacture: string;
    declare dateEmission: Date;
    declare invoiceType: InvoiceType;
    declare dateEcheance: Date;
    declare status: StatusFactures;
    declare notes?: string;
    declare isTva: boolean;
    declare totalAPayer: number;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
}

const initModelFacture = (sequelize: Sequelize) => {
    Facture.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },

            numeroFacture: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            totalAPayer: {
                type: DataTypes.NUMBER,
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

            dateEcheance: {
                type: DataTypes.DATE,
                allowNull: false
            },

            status: {
                type: DataTypes.ENUM(...Object.values(StatusFactures)),
                allowNull: false,
                defaultValue: StatusFactures.EN_ATTENTE
            },

            notes: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            isTva: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }

        },
        {
            sequelize,
            modelName: "Facture",
            tableName: "factures",
            timestamps: true,
            underscored: true,
            paranoid: true
        }
    );
};

export { Facture, initModelFacture };