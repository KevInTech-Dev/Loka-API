import { RefundPayment } from "@/database/models/Refund";
import { RefundPaymentRepository } from "./refund.repository";
import { TransactionRepository } from "../transaction/transaction.repository";
import { RefundStatusEnum } from "@/enums/refundStatusEnum";
import { UserRepository } from "../users/user.repository";
import { ForbiddenError, NotFoundError } from "@/common/errors";
import { PaymentRepository } from "../Payment/payment.repository";
import { allowRefundSchemaType, RefundSchemaType } from "./refund.schema";
import { RefundResponse } from "./refund.type";

export class RefundPaymentService {
    private refundPaymentRepository: RefundPaymentRepository;
    private transactionRepository: TransactionRepository;
    private paymentRepository : PaymentRepository;
    
    constructor() {
        this.refundPaymentRepository = new RefundPaymentRepository();
        this.transactionRepository = new TransactionRepository();
        this.paymentRepository = new PaymentRepository();
    }
    
    async createRdefundPayment(userId: string, data: RefundSchemaType) : Promise<RefundResponse> {
        const transactionReference = await this.transactionRepository.getTransactionReference(data.transactionReference);
        if (!transactionReference) {
            throw new Error("Transaction");
        }
        if(transactionReference.transaction_status !== "COMPLETED") {
            throw new ForbiddenError("You can only refund completed transactions");
        }
        await this.TransactionVerification(data.transactionReference, userId);
        const payment_Id = transactionReference.payment_id;
        const RefundAmount = transactionReference.amount;
        return this.refundPaymentRepository.createRefundPayment({
            ...data,
            paymentId: payment_Id,
            refundAmount: RefundAmount,
            refundStatus : RefundStatusEnum.PENDING,
            allowRefund: false
        });
    }

    async getRefundPaymentById(id: string) : Promise<RefundResponse> {
        return this.refundPaymentRepository.getRefundPaymentById(id);
    }

    async getRefundPaymentsPaginated(page: number, limit: number) : Promise<{ total: number; data: RefundResponse[] }> {
        const { count, rows } = await this.refundPaymentRepository.getRefundPaymentPaginated(page, limit);
        return {
            total: count,
            data: rows,
        };
    }

    async approveRefund(id: string, data: allowRefundSchemaType): Promise<RefundResponse> {
        const refundTransaction = await this.refundPaymentRepository.getRefundPaymentById(id);
        if (!refundTransaction) {
            throw new NotFoundError("Refund transaction");
        }
        if(refundTransaction.refundStatus !== RefundStatusEnum.PENDING) {
            throw new ForbiddenError("Refund transaction is not pending");
        }
        await this.refundPaymentRepository.update(refundTransaction.id, { refundStatus: data.allowRefund ? RefundStatusEnum.APPROVED : RefundStatusEnum.DECLINED });
        return this.refundPaymentRepository.allowRefundPayment(id, data.allowRefund);
    }

    async approveRefundAdmin(id: string, data: allowRefundSchemaType) : Promise<RefundResponse> {
        const refundTransaction = await this.refundPaymentRepository.getRefundPaymentById(id);
        if (!refundTransaction) {
            throw new NotFoundError("Refund transaction");
        }
        if(refundTransaction.refundStatus !== RefundStatusEnum.APPROVED) {
            throw new ForbiddenError("Refund transaction is not approved");
        }
        await this.refundPaymentRepository.update(refundTransaction.id, { refundStatus: data.allowRefund ? RefundStatusEnum.REFUNDED : RefundStatusEnum.DECLINED });
        return this.refundPaymentRepository.allowRefundPayment(id, data.allowRefund);
    }

    private async TransactionVerification(transactionReference: string, userId: string) {
        const transaction = await this.transactionRepository.getTransactionReference(transactionReference);
        if (!transaction) {
            throw new NotFoundError("Transaction");
        }
        if (transaction.sender_id !== userId) {
            throw new ForbiddenError("You are not allowed to refund this payment");
        }
    }
}