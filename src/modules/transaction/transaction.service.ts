import { Transaction } from "@/database/models/Transaction";
import { TransactionMapper } from "./transaction.mappers";
import { TransactionRepository } from "./transaction.repository";
import { CreateTransactionInput } from "./transaction.schema";
import { TransactionResponse } from "./transaction.type";
import { Op } from "sequelize";
import { PaymentRepository } from "../Payment/payment.repository";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "@/common/errors";
import { TransactionStatusEnum } from "@/enums/TransactionStatusEnum";
import { RoleEnum } from "@/enums/RoleEnum";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { TransactionTypeEnum } from "@/enums/TransactionTypeEnum";
import { landLordRepository } from "../landLord/landlord.repository";
import { TenantRepository } from "../tenant/tenant.repository";
import { Payment } from "@/database/models/payment";

export class TransactionService {

    private transactionRepository: TransactionRepository;
    private transactionMapper: TransactionMapper;
    private paymentRepository: PaymentRepository;
    private landlordRepository :  landLordRepository;
    private tenantRepository : TenantRepository;

    constructor() {
        this.transactionRepository = new TransactionRepository();
        this.transactionMapper = new TransactionMapper();
        this.paymentRepository = new PaymentRepository();
        this.landlordRepository = new landLordRepository();
        this.tenantRepository = new TenantRepository();
    }

    async createTransaction(userId: string, role: string, transactionData: CreateTransactionInput) : Promise<TransactionResponse> {
        const payment = await this.paymentRepository.findById(transactionData.payment_id)
        if(!payment){
            throw new NotFoundError("Payment")
        }
        await this.assertPaymentOwnership(payment, userId, role)

        const transactionReference = await this.generateTransactionReference();
        const transaction = await this.transactionRepository.create(this.transactionMapper.toEntity({
            ...transactionData,
            transaction_type: this.mapInvoiceTypeToTransactionType(payment.factureType),
            transaction_status: TransactionStatusEnum.PENDING,
            transaction_reference: transactionReference,
            transaction_date: new Date(),
            description: `Transaction for payment ${payment.payment_reference}`,
            amount: payment.amount_paid,
            currency: payment.currency,
            metadata: {
                payment_reference: payment.payment_reference,
                factureType: payment.factureType,
                payer_email: payment.payer_email,
                payer_phone: payment.payer_phone,
            }
        }));
        return this.transactionMapper.toResponse(transaction);
    }

    async getTransactions(userId: string, role: string, page: number, limit: number): Promise<{ data: TransactionResponse[] , total: number}> {
        const senderId = await this.resolveSenderId(userId, role);
        const { rows, count } = await this.transactionRepository.getTransactionPaginated(page, limit, { role, senderId });
        return { 
            data: rows.map((t) => this.transactionMapper.toResponse(t)), total: count };
    }

    async getTransactionById(id: string, userId: string, role: string): Promise<TransactionResponse> {
        const senderId = await this.resolveSenderId(userId, role);
        const transaction = await this.transactionRepository.findByIdWithAccess(id, { role, senderId });
        if (!transaction) {
            throw new NotFoundError("Transaction");
        }
        return this.transactionMapper.toResponse(transaction);
    }

    private async generateTransactionReference(): Promise<string> {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const datePart = `${year}${month}${day}`;

        const countToday = await Transaction.count({
            where: {
                transaction_reference: {
                    [Op.like]: `TXN-${datePart}-%`,
                },
            },
        });

        const nextNumber = String(countToday + 1).padStart(3, "0");
        return `TXN-${datePart}-${nextNumber}`;
    }

    private async assertPaymentOwnership(payment: Payment, userId: string, role: string): Promise<void> {
        if (role === RoleEnum.ADMIN) {
            return;
        }
        if (role === RoleEnum.LOCATAIRE) {
            const tenant = await this.tenantRepository.getTenantByUserId(userId);
            if (!tenant || tenant.id !== payment.tenant_id) {
                throw new ForbiddenError("You are not the owner of this payment");
            }
        }
        if (role === RoleEnum.PROPRIETAIRE) {
            const landlord = await this.landlordRepository.getlandLordByUserId(userId);
            if (!landlord || landlord.id !== payment.landlord_id) {
                throw new ForbiddenError("You are not the owner of this payment");
            }
        }
    }
    private async resolveSenderId(userId: string, role: string): Promise<string | undefined> {
        if (role === RoleEnum.ADMIN) {
            return undefined; 
        }
        return userId;
    }

    private mapInvoiceTypeToTransactionType(factureType: InvoiceType): TransactionTypeEnum {
        switch (factureType) {
            case InvoiceType.FACTURE_LOYER:
                return TransactionTypeEnum.LOYER;
            case InvoiceType.FACTURE_EAU:
                return TransactionTypeEnum.EAU;
            case InvoiceType.FACTURE_ELEC:
                return TransactionTypeEnum.ELECTRICITE;
            case InvoiceType.ABONNEMENT:
            case InvoiceType.ABONNEMENT_TRIAL:
                return TransactionTypeEnum.ABONNEMENT;
            case InvoiceType.FACTURE_MAINTENANCE:
                return TransactionTypeEnum.MAINTENANCE;
            default:
                return TransactionTypeEnum.AUTRE;
        }
    }
}

