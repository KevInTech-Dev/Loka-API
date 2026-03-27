import { BaseModel } from "@/common/models/base.model";
import { PaymentMethodEnum } from "@/enums/PaymentMethodEnum";
import { PaymentProviderEnum } from "@/enums/PaymentProviderEnum";
import { PaymentStatusEnum } from "@/enums/PaymentStatusEnum";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface PaymentAttributes extends BaseModel {
    payment_reference: string;
    landlord_id?: string | null;
    tenant_id?: string | null;
    facture_loy_id?: string | null;
    facture_ab_id?: string | null;
    facture_water_id?: string | null;
    facture_elec_id?: string | null;
    facture_mtn_id?: string | null;
    payment_date: Date;
    amount_paid: number;
    currency: string;
    payment_method: PaymentMethodEnum;
    payment_provider: PaymentProviderEnum;
    payment_status: PaymentStatusEnum;
    factureType: InvoiceType;
    platform_commission: number;
    landlord_amount: number;
    payer_phone: string;
    payer_email: string;
    receitpt_number: string;
    payment_notes?: string;
    refund_reason?: string;
    refund_at?: Date | null;
}

export interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'payment_notes' | 'refund_reason' | 'refund_at' | 'tenant_id' | 'landlord_id' | 'facture_loy_id' | 'facture_ab_id' | 'facture_water_id' | 'facture_elec_id' | 'facture_mtn_id'> {
}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
    declare id: string;
    declare payment_reference: string;
    declare landlord_id?: string | null;
    declare tenant_id?: string | null;
    declare facture_loy_id?: string | null;
    declare facture_ab_id?: string | null;
    declare facture_water_id?: string | null;
    declare facture_elec_id?: string | null;
    declare facture_mtn_id?: string | null;
    declare payment_date: Date;
    declare amount_paid: number;
    declare currency: string;
    declare factureType: InvoiceType;
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
    declare refund_at?: Date | null;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;

    static associate(models: any) {
        Payment.belongsTo(models.LandLord, { as: 'paymentLandlord', foreignKey: 'landlord_id' });
        Payment.belongsTo(models.Tenant, { as: 'paymentTenant', foreignKey: 'tenant_id' });
        Payment.belongsTo(models.factureLoyer, { as: 'factureLoyer', foreignKey: 'facture_loy_id' });
        Payment.belongsTo(models.FactureAbonnement, { as: 'FactureAbonnement', foreignKey: 'facture_ab_id' });
        Payment.belongsTo(models.factureMaintenance, { as: 'factureMaintenance', foreignKey: 'facture_mtn_id' });
        Payment.belongsTo(models.factureElectricite, { as: 'factureElectricite', foreignKey: 'facture_elec_id' });
        Payment.belongsTo(models.FactureEau, { as: 'FactureEau', foreignKey: 'facture_water_id' });
        Payment.hasMany(models.Transaction, { as: 'paymentTransaction', foreignKey: 'payment_id' });
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
            allowNull: false
        },
        landlord_id: {
            type: DataTypes.UUID,
            allowNull: true
        },
        tenant_id: {
            type: DataTypes.UUID,
            allowNull: true
        },
        facture_loy_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "Facturesloyer",
                key: "id"
            },
        },
        facture_ab_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "facturesAbonnement",
                key: "id"
            },
        },
        facture_water_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "facturesEau",
                key: "id"
            },
        },
        facture_elec_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "FactureElectricite",
                key: "id"
            },
        },
        facture_mtn_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "FactureMaintenance",
                key: "id"
            },
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
        currency: {
            type: DataTypes.STRING(),
            allowNull: false,
            // defaultValue: 'XOF'
        },
        factureType: {
            type: DataTypes.ENUM(...Object.values(InvoiceType)),
            allowNull: false
        },
        payment_method: {
            type: DataTypes.ENUM(...Object.values(PaymentMethodEnum)),
            defaultValue: PaymentMethodEnum.ONLINE,
            allowNull: false
        },
        payment_provider: {
            type: DataTypes.ENUM(...Object.values(PaymentProviderEnum)),
            defaultValue: PaymentProviderEnum.FEDAPAY,
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
            allowNull: true
        }
    }, {
        sequelize, tableName: 'payments', modelName: 'Payment', timestamps: true, underscored: true, paranoid: true
    });
};

export { Payment, initPaymentModel };