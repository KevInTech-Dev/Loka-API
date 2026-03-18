import { BaseRepositoryImpl } from "@/common/base.repository";
import { Facture } from "@/database/models/Facture";
import { LandLord } from "@/database/models/landLord";
import { Payment } from "@/database/models/payment";
import { Tenant } from "@/database/models/Tenants";
import { CreationAttributes } from "sequelize";


export class PaymentRepository extends BaseRepositoryImpl<Payment> {

    constructor() {
        super(Payment);
    }
    
    async create(paymentData: CreationAttributes<Payment>): Promise<Payment> {
        return this.model.create(paymentData);
    }

    async getPaymentPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.model.findAll({ limit, offset, include: [
            {
                model: LandLord,
                as: 'paymentLandlord',  
            },
            {
                model: Tenant,
                as: 'paymentTenant'
            },
            {
                model: Facture,
                as: 'paymentFacture'
            }
        ] });
    }

    async refundPayment(id: string, refundReason: string): Promise<Payment | null> {
        const payment = await this.model.findByPk(id);
        if (!payment) {
            return null;
        }
        payment.refund_reason = refundReason;
        payment.refund_at = new Date();
        return await payment.save();
    }
}