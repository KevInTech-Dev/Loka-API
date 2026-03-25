import { DataTypes, Model, Sequelize } from "sequelize";
import { FactureAttributes, FactureCreationAttributes } from "@database/models/Facture";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { StatusFactures } from "@/enums/StatusFacturesEnum";

export interface FactureLoyerAttributes extends FactureAttributes {
    unitLocation: string;
    idTenant: string;
}

export interface FactureLoyerCreationAttributes extends FactureCreationAttributes {
}

class FactureLoyer extends Model<FactureLoyerAttributes, FactureLoyerCreationAttributes>
    implements FactureLoyerAttributes {
    declare numeroFacture: string;
    declare dateEmission: Date;
    declare invoiceType: InvoiceType;
    declare dateEcheance: Date;
    declare status: StatusFactures;
    declare notes?: string;
    declare isTva: boolean;
    declare id: string;
    declare unitLocation: string;
    declare idTenant: string;
    declare totalAPayer: number;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
    static associate(models: any) {
        FactureLoyer.hasOne(models.Payment, {
            foreignKey: 'facture_loy_id',
            as: 'Payment'
        });
    }
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

            totalAPayer: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            numeroFacture: {
                type: DataTypes.STRING,
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
            tableName: "Facturesloyer",
            modelName: "factureLoyer",
            timestamps: true,
            underscored: true
        }
    );
};

export { FactureLoyer, initModelFactureLoyer };