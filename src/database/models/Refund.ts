import { BaseModel } from "@/common/models/base.model";
import { RefundStatusEnum } from "@/enums/refundStatusEnum";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface RefundPaymentAttributes extends BaseModel {
    transactionReference: string;
    paymentId: string;
    refundReason?: string;
    refundAmount: number;
    refundStatus: RefundStatusEnum;
    allowRefund: boolean;
}

export interface RefundPaymentCreationAttributes extends Optional<RefundPaymentAttributes, 'id' | 'createdAt' | 'updatedAt' > {}

class RefundPayment extends Model<RefundPaymentAttributes, RefundPaymentCreationAttributes> implements RefundPaymentAttributes {
    declare id: string;
    declare transactionReference: string;
    declare paymentId: string;
    declare refundReason?: string;
    declare refundAmount: number;
    declare refundStatus: RefundStatusEnum;
    declare allowRefund: boolean;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
}

const initRefundPaymentModel = (sequelize: Sequelize) => {
    RefundPayment.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            transactionReference: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            paymentId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            refundReason: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            refundAmount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            refundStatus: {
                type: DataTypes.ENUM(...Object.values(RefundStatusEnum)),
                allowNull: false,
                defaultValue: RefundStatusEnum.PENDING
            },
            allowRefund: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            sequelize,
            tableName: "RefundPayments",
            modelName: "RefundPayment",
            timestamps: true,
            underscored: true,
            paranoid: true,
        }
    );
};

export { RefundPayment, initRefundPaymentModel };