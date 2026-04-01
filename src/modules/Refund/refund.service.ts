import { RefundPaymentRepository } from "./refund.repository";
import { TransactionRepository } from "../transaction/transaction.repository";
import { Transactions } from "@/database/models/Transaction";
import { RefundStatusEnum } from "@/enums/refundStatusEnum";
import { ForbiddenError, NotFoundError, ConflictError } from "@/common/errors";
import { PaymentRepository } from "../Payment/payment.repository";
import { allowRefundSchemaType, RefundSchemaType } from "./refund.schema";
import { RefundResponse } from "./refund.type";
import { PaymentStatusEnum } from "@/enums/PaymentStatusEnum";

export class RefundPaymentService {
    private refundPaymentRepository: RefundPaymentRepository;
    private transactionRepository: TransactionRepository;
    private paymentRepository: PaymentRepository;

    constructor() {
        this.refundPaymentRepository = new RefundPaymentRepository();
        this.transactionRepository = new TransactionRepository();
        this.paymentRepository = new PaymentRepository();
    }

    async createRefundPayment(userId: string, data: RefundSchemaType): Promise<RefundResponse> {
        const transaction = await this.transactionRepository.getTransactionReference(data.transactionReference);
        if (!transaction) {
            throw new NotFoundError("Transaction");
        }

        if (!this.isRefundableTransaction(transaction.transaction_status)) {
            throw new ForbiddenError("You can only refund completed or approved transactions");
        }

        this.verifyTransactionOwner(transaction, userId);

        const existingRefund = await this.refundPaymentRepository.findByTransactionReference(data.transactionReference);
        if (existingRefund && existingRefund.refundStatus !== RefundStatusEnum.DECLINED && existingRefund.refundStatus !== RefundStatusEnum.REFUNDED) {
            throw new ConflictError("A refund request already exists for this transaction");
        }

        return this.refundPaymentRepository.createRefundPayment({
            ...data,
            paymentId: transaction.payment_id,
            refundAmount: transaction.amount,
            refundStatus: RefundStatusEnum.PENDING,
            allowRefund: false,
        });
    }

    async getRefundPaymentById(id: string): Promise<RefundResponse> {
        return this.refundPaymentRepository.getRefundPaymentById(id);
    }

    async getRefundPaymentsPaginated(page: number, limit: number): Promise<{ total: number; data: RefundResponse[] }> {
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
        if (refundTransaction.refundStatus !== RefundStatusEnum.PENDING) {
            throw new ForbiddenError("Refund transaction is not pending");
        }

        await this.refundPaymentRepository.update(refundTransaction.id, {
            refundStatus: data.allowRefund ? RefundStatusEnum.APPROVED : RefundStatusEnum.DECLINED,
            allowRefund: data.allowRefund,
        });

        return this.refundPaymentRepository.getRefundPaymentById(refundTransaction.id);
    }

    async approveRefundAdmin(id: string, data: allowRefundSchemaType): Promise<RefundResponse> {
        const refundTransaction = await this.refundPaymentRepository.getRefundPaymentById(id);
        if (!refundTransaction) {
            throw new NotFoundError("Refund transaction");
        }
        if (refundTransaction.refundStatus !== RefundStatusEnum.APPROVED) {
            throw new ForbiddenError("Refund transaction is not approved");
        }

        const updatedRefund = await this.refundPaymentRepository.update(refundTransaction.id, {
            refundStatus: data.allowRefund ? RefundStatusEnum.REFUNDED : RefundStatusEnum.DECLINED,
            allowRefund: data.allowRefund,
        });

        if (data.allowRefund) {
            await this.paymentRepository.updatePayment(refundTransaction.paymentId, {
                payment_status: PaymentStatusEnum.REFUNDED,
                refund_at: new Date(),
            });
        }

        return updatedRefund;
    }

    private isRefundableTransaction(status?: string): boolean {
        if (!status) {
            return false;
        }

       
        const refundableStatuses = [
            "approved",
            "transferred",
        ];

        return refundableStatuses.includes(status);
    }

    private verifyTransactionOwner(transaction: Transactions, userId: string): void {
        if (transaction.sender_id !== userId) {
            throw new ForbiddenError("You are not allowed to refund this payment");
        }
    }
}
