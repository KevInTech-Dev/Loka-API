import { BaseModel } from "@/common/models/base.model";
import { FactureTypeEnum } from "@/enums/FactureTypeEnum";
import { PaymentMethodEnum } from "@/enums/PaymentMethodEnum";
import { PaymentProviderEnum } from "@/enums/PaymentProviderEnum";
import { PaymentStatusEnum } from "@/enums/PaymentStatusEnum";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface PaymentAttributes extends BaseModel{
    payment_reference: string;
    landlord_id: string;
    tenant_id: string;
    facture_id: string;
    payment_date: Date;
    amount_paid: number;
    payment_method: PaymentMethodEnum;
    payment_provider: PaymentProviderEnum;
    payment_status: PaymentStatusEnum;
    factureType: FactureTypeEnum;
    platform_commission: number;
    landlord_amount: number;
    payer_phone: string;
    payer_email: string;
    receitpt_number: string;
    payment_notes?: string;
    refund_reason?: string;
    refund_at: Date;
}

export interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'payment_notes' | 'refund_reason'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes 
   {
    declare id: string;
    declare payment_reference: string;
    declare landlord_id: string;
    declare tenant_id: string;
    declare facture_id: string;
    declare payment_date: Date;
    declare amount_paid: number;
    declare factureType: FactureTypeEnum;
    declare payment_method: PaymentMethodEnum;
    declare payment_provider: PaymentProviderEnum;
    declare payment_status: PaymentStatusEnum;
    declare platform_commission: number;
    declare landlord_amount: number;
    declare payer_phone: string;
    declare payer_email: string;
    declare receitpt_number: string;
    declare payment_notes?: string;
    declare refund_reason?: string;
    declare refund_at: Date;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
    static associate(models: any) {
        Payment.belongsTo(models.Landlord, { as: 'paymentLandlord', foreignKey: 'landlord_id' });
        Payment.belongsTo(models.Tenant, { as: 'paymentTenant', foreignKey: 'tenant_id' });
        Payment.belongsTo(models.Facture, { as: 'paymentFacture', foreignKey: 'facture_id' });
    }
   }

   const initPaymentModel = (sequelize: Sequelize) => {
    Payment.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        payment_reference: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        landlord_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        facture_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        payment_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        amount_paid: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        factureType:{
            type: DataTypes.ENUM(...Object.values(FactureTypeEnum)),
            allowNull: false
        },
        payment_method: {
            type: DataTypes.ENUM(...Object.values(PaymentMethodEnum)),
            defaultValue: PaymentMethodEnum.ONLINE,
            allowNull: false
        },
        payment_provider: {
            type: DataTypes.ENUM(...Object.values(PaymentProviderEnum)),
            defaultValue: PaymentProviderEnum.STRIPE,
            allowNull: false
        },
        payment_status: {
            type: DataTypes.ENUM(...Object.values(PaymentStatusEnum)),
            defaultValue: PaymentStatusEnum.PENDING,
            allowNull: false
        },
        platform_commission: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        landlord_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        payer_phone: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false
        },
        payer_email: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false
        },
        receitpt_number: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false
        },
        payment_notes: {
            type: DataTypes.STRING,
            allowNull: true
        },
        refund_reason: {
            type: DataTypes.STRING,
            allowNull: true
        },
        refund_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        sequelize, tableName:'payments', modelName: 'Payment', timestamps: true, underscored: true, paranoid: true
    });
   };

    export { Payment, initPaymentModel };