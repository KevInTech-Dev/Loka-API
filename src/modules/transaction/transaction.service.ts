import { Transaction, Transactions} from "@/database/models/Transaction";
import { TransactionMapper } from "./transaction.mappers";
import { TransactionRepository } from "./transaction.repository";
import { CreateTransactionInput } from "./transaction.schema";
import { TransactionResponse } from "./transaction.type";
import { Op } from "sequelize";
import env from '@/config/env';
import { PaymentRepository } from "../Payment/payment.repository";
import {BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "@/common/errors";
import { TransactionStatusEnum } from "@/enums/TransactionStatusEnum";
import { landLordRepository } from "../landLord/landlord.repository";
import { UserRepository } from "../users/user.repository";
import { RoleEnum } from "@/enums/RoleEnum";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { TransactionTypeEnum } from "@/enums/TransactionTypeEnum";
import { TenantRepository } from "../tenant/tenant.repository";
import { Payment } from "@/database/models/payment";

export class TransactionService {

    private transactionRepository: TransactionRepository;
    private transactionMapper: TransactionMapper;
    private paymentRepository: PaymentRepository;
    private landlordRepository :  landLordRepository;
    private tenantRepository : TenantRepository;
    private utilisateurRepository: UserRepository;

    constructor() {
        this.transactionRepository = new TransactionRepository();
        this.transactionMapper = new TransactionMapper();
        this.paymentRepository = new PaymentRepository();
        this.landlordRepository = new landLordRepository();
        this.utilisateurRepository = new UserRepository()
        this.landlordRepository = new landLordRepository();
        this.tenantRepository = new TenantRepository();
    }

   /* async createTransaction(transactionData: CreateTransactionInput): Promise<TransactionResponse> {
        const payment = await this.paymentRepository.findById(transactionData.payment_id)
        if (!payment) {
            throw new NotFoundError("Payment")
        }

        const alreadyInitialized = await Transactions.findOne({
    async createTransaction(transactionData: CreateTransactionInput): Promise<TransactionResponse> {
            where: {
                payment_id: payment.id,
                transaction_status: {
                    [Op.in]: [TransactionStatusEnum.PENDING, TransactionStatusEnum.COMPLETED],
                },
            },
        });
        if (alreadyInitialized) {
            throw new BadRequestError("Transaction already initialized for this payment");
        }
        const transactionReference = await this.generateTransactionReference();

        //recuperer l'utilisateur qui effectue le paiement
        const landlordTransaction = await this.landlordRepository.findById(transactionData.landlord_id);
        if (!landlordTransaction) {
            throw new NotFoundError("Landlord was")
        }
        const userTransaction = await this.utilisateurRepository.findById(landlordTransaction.userId);
        if (!userTransaction) {
            throw new NotFoundError("User was")
        }


        const { FedaPay, Transaction } = require('fedapay');
        FedaPay.setApiKey(env.FEDAPAY_SECRET_KEY);
        FedaPay.setEnvironment(env.FEDAPAY_ENVIRONNEMENT);
        const transactionF = await Transaction.create({
            description: 'PAIEMENT DE FACTURE',
            amount: transactionData.amount,
            currency: { iso: 'XOF' },
            callback_url: 'https://example.com/callback',
            mode: 'mtn_open',
            customer: {
                id: userTransaction.id,
                email: userTransaction.email,
                firstname: userTransaction.firstname,
                lastname: userTransaction.lastname,
                phone_number: userTransaction.phoneNumber
            }
        });

        const transaction = await this.transactionRepository.create(
            {
                ...transactionData,
                idFedapay: transactionF.id,
                referenceFedapay: transactionF.reference,
                transaction_status: transactionF.status,
                transaction_reference: transactionReference,
                callback_url: transactionF.callback_url
            }


        );
        return this.transactionMapper.toResponse(transaction);
    }*/



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

        const countToday = await Transactions.count({
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

