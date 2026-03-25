import { Transaction } from "@/database/models/Transaction";
import { TransactionMapper } from "./transaction.mappers";
import { TransactionRepository } from "./transaction.repository";
import { CreateTransactionInput } from "./transaction.schema";
import { TransactionResponse } from "./transaction.type";
import { Op } from "sequelize";
import { PaymentRepository } from "../Payment/payment.repository";
import { BadRequestError, NotFoundError } from "@/common/errors";
import { Payment } from "@/database/models/payment";
import { TransactionStatusEnum } from "@/enums/TransactionStatusEnum";

export class TransactionService {

    private transactionRepository: TransactionRepository;
    private transactionMapper: TransactionMapper;
    private paymentRepository: PaymentRepository;

    constructor() {
        this.transactionRepository = new TransactionRepository();
        this.transactionMapper = new TransactionMapper();
        this.paymentRepository = new PaymentRepository();
    }

    async createTransaction(transactionData: CreateTransactionInput) : Promise<TransactionResponse> {
        const payment = await this.paymentRepository.findById(transactionData.payment_id)
        if(!payment){
            throw new NotFoundError("Payment")
        }

        const alreadyInitialized = await Transaction.findOne({
            where: {
                payment_id: payment.id,
                transaction_status: {
                    [Op.in]: [TransactionStatusEnum.PENDING, TransactionStatusEnum.COMPLETED],
                },
            },
        });
        if(alreadyInitialized){
            throw new BadRequestError("Transaction already initialized for this payment");
        }
        const transactionReference = await this.generateTransactionReference();
        const transaction = await this.transactionRepository.create(this.transactionMapper.toEntity({
            ...transactionData,

            transaction_reference: transactionReference,
            transaction_date: new Date(),

        }));
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
}
