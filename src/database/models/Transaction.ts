import { BaseModel } from "../../common/models/base.model";
import { TransactionStatusEnum } from "../../enums/TransactionStatusEnum";
import { TransactionTypeEnum } from "../../enums/TransactionTypeEnum";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface TransactionAttributes extends BaseModel {
    payment_id: string;
    sender_id?: string;
    transaction_type: TransactionTypeEnum;
    transaction_status: TransactionStatusEnum;
    transaction_reference: string;
    transaction_date: Date;
    amount: number;
    currency: string;
    description: string;
    metadata?: unknown;
}

export interface TransactionCreationAttributes extends Optional<
    TransactionAttributes,
    "id" | "createdAt" | "updatedAt" | "metadata" | "sender_id" 
> {}

class Transaction
    extends Model<TransactionAttributes, TransactionCreationAttributes>
    implements TransactionAttributes
{
    declare id: string;
    declare payment_id: string;
    declare sender_id?: string;
    declare landlord_id?: string | null;
    declare transaction_type: TransactionTypeEnum;
    declare transaction_status: TransactionStatusEnum;
    declare transaction_reference: string;
    declare transaction_date: Date;
    declare amount: number;
    declare currency: string;
    declare description: string;
    declare metadata?: unknown;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;

    static associate(models: any) {
        Transaction.belongsTo(models.Payment, {
            foreignKey: 'payment_id',
            as: 'transactionPayment'
        });
        Transaction.belongsTo(models.LandLord, {
            foreignKey: 'landlord_id',
            as: 'transactionLandlord'
        });
    }
}

const initModelTransaction = (sequelize: Sequelize) => {
    Transaction.init(
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
            sender_id: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onDelete: 'SET NULL'
            },
            transaction_type: {
                type: DataTypes.ENUM(...Object.values(TransactionTypeEnum)),
                allowNull: false
            },
            transaction_status: {
                type: DataTypes.ENUM(...Object.values(TransactionStatusEnum)),
                defaultValue: TransactionStatusEnum.PENDING,
                allowNull: false
            },
            transaction_reference: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            transaction_date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
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

export { Transaction, initModelTransaction };
