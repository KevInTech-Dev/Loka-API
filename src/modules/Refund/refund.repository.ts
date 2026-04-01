import { NotFoundError } from "@/common/errors";
import { RefundPayment, RefundPaymentCreationAttributes } from "@/database/models/Refund";
import { ModelStatic } from "sequelize";

export class RefundPaymentRepository {

    private RefundPayment: ModelStatic<RefundPayment>;

    constructor() {
        this.RefundPayment = RefundPayment;
    }

    async createRefundPayment(data: RefundPaymentCreationAttributes) {
        return this.RefundPayment.create(data);
    }

    async findByTransactionReference(transactionReference: string) {
        return this.RefundPayment.findOne({
            where: {
                transactionReference,
            },
        });
    }

    async getRefundPaymentById(id: string) {
        return this.RefundPayment.findByPk(id);
    }

    async getRefundPaymentPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.RefundPayment.findAndCountAll({
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        });
    }

    async allowRefundPayment(id: string, allowRefund: boolean) {
        const refundPayment = await this.RefundPayment.findByPk(id);
        if (!refundPayment) {
            throw new NotFoundError("Refund payment");
        }
        return refundPayment.update({ allowRefund });
    }
    async update(id: string, data: Partial<RefundPaymentCreationAttributes>) {
        const refundPayment = await this.RefundPayment.findByPk(id);
        if (!refundPayment) {
            throw new NotFoundError("Refund payment");
        }
        return refundPayment.update(data);
    }
}