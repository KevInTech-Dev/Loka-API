import { BaseRepositoryImpl } from "@/common/base.repository";
import { NotFoundError } from "@/common/errors";
import { FactureAbonnement } from "@/database/models/FactureAbonnment";
import { FactureEau } from "@/database/models/FactureEau";
import { FactureElectricite } from "@/database/models/FactureElectricite";
import { FactureLoyer } from "@/database/models/FactureLoyer";
import { FactureMaintenance } from "@/database/models/FacturesMaintenance";
import { LandLord } from "@/database/models/landLord";
import { Payment, PaymentCreationAttributes } from "@/database/models/payment";
import { Tenant } from "@/database/models/Tenants";
import { User } from "@/database/models/Users";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { RoleEnum } from "@/enums/RoleEnum";
import { CreationAttributes, Transaction } from "sequelize";

type FactureDetails =
    | FactureLoyer
    | FactureEau
    | FactureElectricite
    | FactureAbonnement
    | FactureMaintenance;

export class PaymentRepository extends BaseRepositoryImpl<Payment> {

    constructor() {
        super(Payment);
    }

    async create(paymentData: CreationAttributes<Payment>, transaction?: Transaction): Promise<Payment> {
        return this.model.create(paymentData, { transaction });
    }

    async findById(id: string): Promise<Payment | null> {
        return this.model.findByPk(id, {
            include: [
                { model: LandLord, as: 'paymentLandlord' },
                { model: Tenant, as: 'paymentTenant' },
                { model: FactureLoyer, as: 'factureLoyer' },
                { model: FactureAbonnement, as: 'FactureAbonnement' },
                { model: FactureMaintenance, as: 'factureMaintenance' },
                { model: FactureElectricite, as: 'factureElectricite' },
                { model: FactureEau, as: 'FactureEau' },
            ]
        });
    }

    async getPaymentPaginated(page: number, limit: number, userId: string, role: string) {
        const offset = (page - 1) * limit;

        const { rows, count } = await this.model.findAndCountAll({
            where: {
                ...(role === RoleEnum.PROPRIETAIRE && {
                    landlord_id: {
                        includes: [{ model: User, as: 'userLandlord', where: { id: userId } }]
                    }
                }),
                ...(role === RoleEnum.LOCATAIRE && {
                    tenant_id: {
                        includes: [{ model: User, as: 'userTenant', where: { id: userId } }]
                    }
                }),
            },
            limit,
            offset,
            include: [
                { model: LandLord, as: 'paymentLandlord' },
                { model: Tenant, as: 'paymentTenant' },
            ],
            order: [['createdAt', 'DESC']],
        });

        return { rows, count };

    }

    async countByYearMonth(year: number, month: string): Promise<number> {
        return this.model.count({
            where: {
                payment_reference: {
                    [this.Op.like]: `PAY-${year}-${month}%`
                }
            }
        });
    }

    async getFactureByTypeAndId(invoiceType: InvoiceType, factureId: string, transaction?: Transaction): Promise<FactureDetails | null> {
        const options = transaction ? { transaction } : {};
        switch (invoiceType) {
            case InvoiceType.FACTURE_LOYER:
                return FactureLoyer.findByPk(factureId, options);
            case InvoiceType.FACTURE_EAU:
                return FactureEau.findByPk(factureId, options);
            case InvoiceType.FACTURE_ELEC:
                return FactureElectricite.findByPk(factureId, options);
            case InvoiceType.FACTURE_MAINTENANCE:
                return FactureMaintenance.findByPk(factureId, options);
            case InvoiceType.ABONNEMENT:
            case InvoiceType.ABONNEMENT_TRIAL:
                return FactureAbonnement.findByPk(factureId, options);
            default:
                return null;
        }
    }

    async refundPayment(id: string, refundReason?: string): Promise<Payment | null> {
        const payment = await this.model.findByPk(id);
        if (!payment) {
            return null;
        }
        payment.refund_reason = refundReason;
        payment.refund_at = new Date();
        return await payment.save();
    }

    async getPaymentWithInvoiceId(invoiceNumber: string, typeFacture: InvoiceType) {
        if (typeFacture = InvoiceType.ABONNEMENT) {
            return this.model.findOne({
                where: {
                    facture_ab_id: invoiceNumber,
                }
            })
        } else if (typeFacture = InvoiceType.FACTURE_EAU) {
            return this.model.findOne({
                where: {
                    facture_water_id: invoiceNumber,
                }
            })
        } else if (typeFacture = InvoiceType.FACTURE_ELEC) {
            return this.model.findOne({
                where: {
                    facture_elec_id: invoiceNumber,
                }
            })
        } else if (typeFacture = InvoiceType.FACTURE_LOYER) {
            return this.model.findOne({
                where: {
                    facture_loy_id: invoiceNumber,
                }
            })
        } else if (typeFacture = InvoiceType.FACTURE_MAINTENANCE) {
            return this.model.findOne({
                where: {
                    facture_mtn_id: invoiceNumber,
                }
            })
        }

    }

    async updatePayment(id: string, data: PaymentCreationAttributes) {
        const paymentObject = await this.findById(id);
        if (!paymentObject) {
            throw new NotFoundError("PAYMENT NOT FOUND");
        }
        await paymentObject.update(data);
        return paymentObject
    }
}