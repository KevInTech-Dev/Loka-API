import { Transactions } from "@/database/models/Transaction";
import { TransactionMapper } from "./transaction.mappers";
import { TransactionRepository } from "./transaction.repository";
import { CreateTransactionInput } from "./transaction.schema";
import { TransactionResponse } from "./transaction.type";
import { Op } from "sequelize";
import env from '@/config/env';
import { PaymentRepository } from "../Payment/payment.repository";
import { BadRequestError, NotFoundError } from "@/common/errors";
import { TransactionStatusEnum } from "@/enums/TransactionStatusEnum";
import { landLordRepository } from "../landLord/landlord.repository";
import { UserRepository } from "../users/user.repository";

export class TransactionService {

    private transactionRepository: TransactionRepository;
    private transactionMapper: TransactionMapper;
    private paymentRepository: PaymentRepository;
    private landlordRepository: landLordRepository;
    private utilisateurRepository: UserRepository;

    constructor() {
        this.transactionRepository = new TransactionRepository();
        this.transactionMapper = new TransactionMapper();
        this.paymentRepository = new PaymentRepository();
        this.landlordRepository = new landLordRepository();
        this.utilisateurRepository = new UserRepository()
    }

    async createTransaction(transactionData: CreateTransactionInput): Promise<TransactionResponse> {
        const payment = await this.paymentRepository.findById(transactionData.payment_id)
        if (!payment) {
            throw new NotFoundError("Payment")
        }

        const alreadyInitialized = await Transactions.findOne({
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
}
