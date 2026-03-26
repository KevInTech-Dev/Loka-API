import { BaseModel } from "../../common/models/base.model";
import { TransactionTypeEnum } from "../../enums/TransactionTypeEnum";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface TransactionAttributes extends BaseModel {
    payment_id: string;
    landlord_id?: string | null;
    idFedapay: string;
    referenceFedapay: string;
    transaction_type: TransactionTypeEnum;
    transaction_status: string;
    transaction_reference: string;
    //transaction_date: Date;
    amount: number;
    currency: string;
    description: string;
    callback_url?: string | null;
    metadata?: unknown;
}

export interface TransactionCreationAttributes extends Optional<
    TransactionAttributes,
    "id" | "createdAt" | "updatedAt" | "metadata" | "landlord_id" | "callback_url"
> { }

class Transactions
    extends Model<TransactionAttributes, TransactionCreationAttributes>
    implements TransactionAttributes {
    declare id: string;
    declare payment_id: string;
    declare landlord_id?: string | null;
    declare transaction_type: TransactionTypeEnum;
    declare transaction_status: string;
    declare transaction_reference: string;
    declare idFedapay: string;
    declare referenceFedapay: string;
    //declare transaction_date: Date;
    declare amount: number;
    declare currency: string;
    declare description: string;
    declare callback_url?: string | null;
    declare metadata?: unknown;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;

    static associate(models: any) {
        Transactions.belongsTo(models.Payment, {
            foreignKey: 'payment_id',
            as: 'transactionPayment'
        });
        Transactions.belongsTo(models.LandLord, {
            foreignKey: 'landlord_id',
            as: 'transactionLandlord'
        });
    }
}

const initModelTransaction = (sequelize: Sequelize) => {
    Transactions.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            payment_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'payments',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            idFedapay: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            referenceFedapay: {
                type: DataTypes.STRING,
                allowNull: false
            },
            landlord_id: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'landlords',
                    key: 'id'
                },
                onDelete: 'SET NULL'
            },
            transaction_type: {
                type: DataTypes.ENUM(...Object.values(TransactionTypeEnum)),
                allowNull: false
            },
            transaction_status: {
                type: DataTypes.STRING,
                allowNull: false
            },
            transaction_reference: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            currency: {
                type: DataTypes.STRING(3),
                allowNull: false,
                defaultValue: 'XOF'
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            callback_url: {
                type: DataTypes.STRING,
                allowNull: true
            },
            metadata: {
                type: DataTypes.JSON,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'Transaction',
            tableName: 'transactions',
            timestamps: true,
            underscored: true,
            paranoid: true
        }
    );
};

export { Transactions, initModelTransaction };
