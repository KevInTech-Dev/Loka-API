import { Transactions } from "@/database/models/Transaction";
//import { TransactionMapper } from "./transaction.mappers";
import { TransactionRepository } from "./transaction.repository";
import { CreateTransactionInput } from "./transaction.schema";
import { TransactionResponse } from "./transaction.type";
import { Op } from "sequelize";
import env from '@/config/env';
import { PaymentRepository } from "../Payment/payment.repository";
import { ForbiddenError, NotFoundError } from "@/common/errors";
import { landLordRepository } from "../landLord/landlord.repository";
import { UserRepository } from "../users/user.repository";
import { RoleEnum } from "@/enums/RoleEnum";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { TransactionTypeEnum } from "@/enums/TransactionTypeEnum";
import { TenantRepository } from "../tenant/tenant.repository";
import { Payment } from "@/database/models/payment";

import { FactureAbonnementRepository } from "../Facture_Abonnement/facture.repository";
import { FactureElectriciteRepository } from "../Facture_Electricite/facture.repository";
import { FactureEauRepository } from "../Facture_Eau/facture.repository";
import { FactureLoyerRepository } from "../Facture_Loyer/facture.repository";
import { FactureMaintenanceRepository } from "../Facture_Maintenance/facture.repository";
import { PaymentStatusEnum } from "@/enums/PaymentStatusEnum";
import { FedapayEnvConfig } from "@/common/fedapayEnvironnementConfig";

export class TransactionService {

    private transactionRepository: TransactionRepository;
    //private transactionMapper: TransactionMapper;
    private paymentRepository: PaymentRepository;
    private landlordRepository: landLordRepository;
    private tenantRepository: TenantRepository;
    private utilisateurRepository: UserRepository;
    private factureAbonnementRepository: FactureAbonnementRepository;
    private factureElectriciteRepository: FactureElectriciteRepository;
    private factureEauRepository: FactureEauRepository;
    private factureloyerRepository: FactureLoyerRepository;
    private factureMaintenanceRepository: FactureMaintenanceRepository;
    private fedapayConfig: FedapayEnvConfig;


    constructor() {
        this.transactionRepository = new TransactionRepository();
        //this.transactionMapper = new TransactionMapper();
        this.paymentRepository = new PaymentRepository();
        this.landlordRepository = new landLordRepository();
        this.utilisateurRepository = new UserRepository()
        this.landlordRepository = new landLordRepository();
        this.tenantRepository = new TenantRepository();
        this.factureAbonnementRepository = new FactureAbonnementRepository();
        this.factureEauRepository = new FactureEauRepository();
        this.factureElectriciteRepository = new FactureElectriciteRepository();
        this.factureloyerRepository = new FactureLoyerRepository();
        this.fedapayConfig = new FedapayEnvConfig();
        this.factureMaintenanceRepository = new FactureMaintenanceRepository()
    }

    async getCallBackUrl(transactionId: number) {
        const Transaction = await this.fedapayConfig.exportFedapayEnvConfig();
        const transaction = await Transaction.retrieve(transactionId);
        if (!transaction) {
            throw new Error("Aucune transaction n'as été retrouvé")
        }
        //Récuperer la transactions en base de données associé à l'id de la transaction fedapay
        const transactions = await this.transactionRepository.getTransactionById(String(transaction.id));

        //mettre à jour le statut de la transaction

        console.log(transactions.transaction_status, transaction.status)
        const update = await this.transactionRepository.update(transactions.id, { transaction_status: transaction.status });

        //mettre à jour le statut du paiement
        const paymentOfTransaction = await this.paymentRepository.findById(transactions.payment_id);

        if (!paymentOfTransaction) {
            throw new NotFoundError("Payment not found");
        }

        switch (transaction.status) {
            case transaction.status = 'pending':
                await this.paymentRepository.update(paymentOfTransaction.id, { payment_status: PaymentStatusEnum.PENDING });
                break;
            case transaction.status = 'approved':
                await this.paymentRepository.update(paymentOfTransaction.id, { payment_status: PaymentStatusEnum.APPROVED });
                break;
            case transaction.status = 'declined':
                await this.paymentRepository.update(paymentOfTransaction.id, { payment_status: PaymentStatusEnum.DECLINED });
                break;
            case transaction.status = 'canceled':
                await this.paymentRepository.update(paymentOfTransaction.id, { payment_status: PaymentStatusEnum.FAILED });
                break;
            case transaction.status = 'refunded':
                await this.paymentRepository.update(paymentOfTransaction.id, { payment_status: PaymentStatusEnum.REFUNDED });
                break;
            case transaction.status = 'transferred':
                await this.paymentRepository.update(paymentOfTransaction.id, { payment_status: PaymentStatusEnum.TRANSFERRED });
                break;
        }
    }

    async createTransaction(role: string, userId: string, transactionData: CreateTransactionInput): Promise<TransactionResponse> {
        /**
         * Pour effectuer un paiment l'utilisateur saisi le numero de la facture 
         * On verifie si cette facture existe 
         * On recupere le paiement associé a cette facture
         * on procède à la transaction
         */
        switch (transactionData.type_facture) {
            case InvoiceType.ABONNEMENT:
                const checkSubInvoice = await this.factureAbonnementRepository.checkIfInvoiceNumberExist(transactionData.numero_facture);
                if (!checkSubInvoice) {
                    throw new NotFoundError("Subscription invoice");
                }
                const subPaymentId = await this.paymentRepository.getPaymentWithInvoiceId(checkSubInvoice.id, InvoiceType.ABONNEMENT);

                const transactionReference = await this.generateTransactionReference();

                //recuperer l'utilisateur qui effectue le paiement
                const userTransaction = await this.utilisateurRepository.findById(userId);
                if (!userTransaction) {
                    throw new NotFoundError("User was")
                }
                try {
                    const contacTab = userTransaction.phoneNumber.split(/ /g);
                    const number = contacTab[1];

                    const Transaction = await this.fedapayConfig.exportFedapayEnvConfig();
                    const transactionF = await Transaction.create({
                        description: `PAIEMENT DE FACTURE`,
                        amount: checkSubInvoice.totalAPayer,
                        currency: { iso: 'XOF' },
                        callback_url: 'http://localhost:4000/api/transactions/callback',
                        mode: 'mtn_open',
                        customer: {
                            //id: userTransaction.id,
                            email: userTransaction.email,
                            firstname: userTransaction.firstname,
                            lastname: userTransaction.lastname,
                            phone_number: {
                                number,
                                country: 'TG'
                            }
                        }
                    });
                    //console.log("--------------------------------------> : ", transactionF);
                    const transaction = await this.transactionRepository.create(
                        {
                            payment_id: subPaymentId.id,
                            idFedapay: transactionF.id,
                            referenceFedapay: transactionF.reference,
                            sender_id: userTransaction.id,
                            transaction_type: TransactionTypeEnum.ABONNEMENT,
                            transaction_status: transactionF.status,
                            transaction_reference: transactionReference,
                            amount: transactionF.amount,
                            currency: transactionF.currency,
                            description: transactionF.description,
                            callback_url: transactionF.callback_url,
                            operation: transactionF.operation,
                            payment_token: transactionF.payment_token,
                            payment_url: transactionF.payment_url
                        }

                    );
                    if (transaction) { return transaction; }
                } catch (e) {
                    console.log("Erreur de fedapay : ", e.httpResponse.data.errors);
                    throw new Error(e.message)
                }
                break;
            case InvoiceType.ABONNEMENT_TRIAL:
                const checkSubInvoiceTrial = await this.factureAbonnementRepository.checkIfInvoiceNumberExist(transactionData.numero_facture);
                if (!checkSubInvoiceTrial) {
                    throw new NotFoundError("Subscription trial invoice");
                }
                const sunTrialPaymentId = await this.paymentRepository.getPaymentWithInvoiceId(checkSubInvoiceTrial.id, InvoiceType.ABONNEMENT_TRIAL);
                const transactionReferenceTrial = await this.generateTransactionReference();

                //recuperer l'utilisateur qui effectue le paiement
                const userTransactionTrial = await this.utilisateurRepository.findById(userId);
                if (!userTransactionTrial) {
                    throw new NotFoundError("User was")
                }
                try {
                    const contacTabTrial = userTransactionTrial.phoneNumber.split(/ /g);
                    const number = contacTabTrial[1];

                    const Transaction = await this.fedapayConfig.exportFedapayEnvConfig();
                    const transactionFTrial = await Transaction.create({
                        description: `PAIEMENT DE FACTURE ${InvoiceType.ABONNEMENT_TRIAL} LE ${new Date()}`,
                        amount: checkSubInvoiceTrial.totalAPayer,
                        currency: 'XOF',
                        callback_url: 'https://example.com/callback',
                        //mode: 'mtn_open',
                        customer: {
                            //id: userTransactionTrial.id,
                            email: userTransactionTrial.email,
                            firstname: userTransactionTrial.firstname,
                            lastname: userTransactionTrial.lastname,
                            phone_number: {
                                number: number,
                                code: 'TG'
                            }
                        }
                    });

                    const transactionTrial = await this.transactionRepository.create(
                        {
                            payment_id: sunTrialPaymentId.id,
                            idFedapay: transactionFTrial.id,
                            referenceFedapay: transactionFTrial.reference,
                            sender_id: userTransactionTrial.id,
                            transaction_type: TransactionTypeEnum.ABONNEMENT,
                            transaction_status: transactionFTrial.status,
                            transaction_reference: transactionReferenceTrial,
                            amount: transactionFTrial.amount,
                            currency: transactionFTrial.currency,
                            description: transactionFTrial.description,
                            callback_url: transactionFTrial.callback_url,
                            operation: transactionFTrial.operation,
                            payment_token: transactionFTrial.payment_token,
                            payment_url: transactionFTrial.payment_url
                        }

                    );
                    if (transactionTrial) { return transactionTrial; }
                } catch (e) {
                    console.log("Erreur de fedapay : ", e);
                    throw new Error(e.message)
                }
                break;

            case InvoiceType.FACTURE_EAU:
                const checkWaterInvoice = await this.factureEauRepository.checkIfInvoiceNumberExist(transactionData.numero_facture);
                if (!checkWaterInvoice) {
                    throw new NotFoundError("Water invoice");
                }
                const waterInvoicePaymentId = await this.paymentRepository.getPaymentWithInvoiceId(checkWaterInvoice.id, InvoiceType.FACTURE_EAU);
                const transactionReferenceEau = await this.generateTransactionReference();

                //recuperer l'utilisateur qui effectue le paiement
                const userTransactionEau = await this.utilisateurRepository.findById(userId);
                if (!userTransactionEau) {
                    throw new NotFoundError("User was")
                }
                try {
                    const contacTabEau = userTransactionEau.phoneNumber.split(/ /g);
                    const number = contacTabEau[1];

                    const Transaction = await this.fedapayConfig.exportFedapayEnvConfig();
                    const transactionFEau = await Transaction.create({
                        description: `PAIEMENT DE FACTURE`,
                        amount: checkWaterInvoice.totalAPayer,
                        currency: 'XOF',
                        callback_url: 'https://example.com/callback',
                        //mode: 'mtn_open',
                        customer: {
                            //id: userTransactionEau.id,
                            email: userTransactionEau.email,
                            firstname: userTransactionEau.firstname,
                            lastname: userTransactionEau.lastname,
                            phone_number: {
                                number: number,
                                code: 'TG'
                            }
                        }
                    });

                    const transactionEau = await this.transactionRepository.create(
                        {
                            payment_id: waterInvoicePaymentId.id,
                            idFedapay: transactionFEau.id,
                            referenceFedapay: transactionFEau.reference,
                            sender_id: userTransactionEau.id,
                            transaction_type: TransactionTypeEnum.EAU,
                            transaction_status: transactionFEau.status,
                            transaction_reference: transactionReferenceEau,
                            amount: transactionFEau.amount,
                            currency: transactionFEau.currency,
                            description: transactionFEau.description,
                            callback_url: transactionFEau.callback_url,
                            operation: transactionFEau.operation,
                            payment_token: transactionFEau.payment_token,
                            payment_url: transactionFEau.payment_url
                        }

                    );
                    if (transactionEau) { return transactionEau; }
                } catch (e) {
                    console.log("Erreur de fedapay : ", e);
                    throw new Error(e.message)
                }
                break;

            case InvoiceType.FACTURE_ELEC:
                const checkElecInvoice = await this.factureElectriciteRepository.checkIfInvoiceNumberExist(transactionData.numero_facture);
                if (!checkElecInvoice) {
                    throw new NotFoundError("Electricity invoice");
                }
                const elecInvoicePaymentId = await this.paymentRepository.getPaymentWithInvoiceId(checkElecInvoice.id, InvoiceType.FACTURE_ELEC);
                const transactionReferenceElec = await this.generateTransactionReference();

                //recuperer l'utilisateur qui effectue le paiement
                const userTransactionElec = await this.utilisateurRepository.findById(userId);
                if (!userTransactionElec) {
                    throw new NotFoundError("User was")
                }
                try {
                    const contacTabElec = userTransactionElec.phoneNumber.split(/ /g);
                    const number = contacTabElec[1];

                    const Transaction = await this.fedapayConfig.exportFedapayEnvConfig();
                    const transactionFElec = await Transaction.create({
                        description: `PAIEMENT DE FACTURE`,
                        amount: checkElecInvoice.totalAPayer,
                        currency: 'XOF',
                        callback_url: 'https://example.com/callback',
                        //mode: 'mtn_open',
                        customer: {
                            //id: userTransactionElec.id,
                            email: userTransactionElec.email,
                            firstname: userTransactionElec.firstname,
                            lastname: userTransactionElec.lastname,
                            phone_number: {
                                number: number,
                                code: 'TG'
                            }
                        }
                    });

                    const transactionElec = await this.transactionRepository.create(
                        {
                            payment_id: elecInvoicePaymentId.id,
                            idFedapay: transactionFElec.id,
                            referenceFedapay: transactionFElec.reference,
                            sender_id: userTransactionElec.id,
                            transaction_type: TransactionTypeEnum.ELECTRICITE,
                            transaction_status: transactionFElec.status,
                            transaction_reference: transactionReferenceElec,
                            amount: transactionFElec.amount,
                            currency: transactionFElec.currency,
                            description: transactionFElec.description,
                            callback_url: transactionFElec.callback_url,
                            operation: transactionFElec.operation,
                            payment_token: transactionFElec.payment_token,
                            payment_url: transactionFElec.payment_url
                        }

                    );
                    if (transactionElec) { return transactionElec };
                } catch (e) {
                    console.log("Erreur de fedapay : ", e);
                    throw new Error(e.message)
                }
                break;

            case InvoiceType.FACTURE_LOYER:
                const checkRentInvoice = await this.factureloyerRepository.checkIfInvoiceNumberExist(transactionData.numero_facture);
                if (!checkRentInvoice) {
                    throw new NotFoundError("Rent invoice");
                }
                const loyInvoicePaymentId = await this.paymentRepository.getPaymentWithInvoiceId(checkRentInvoice.id, InvoiceType.FACTURE_LOYER);
                const transactionReferenceLoy = await this.generateTransactionReference();

                //recuperer l'utilisateur qui effectue le paiement
                const userTransactionLoy = await this.utilisateurRepository.findById(userId);
                if (!userTransactionLoy) {
                    throw new NotFoundError("User was")
                }
                try {
                    const contacTabLoy = userTransactionLoy.phoneNumber.split(/ /g);
                    const number = contacTabLoy[1];

                    const Transaction = await this.fedapayConfig.exportFedapayEnvConfig();
                    const transactionFLoy = await Transaction.create({
                        description: `PAIEMENT DE FACTURE`,
                        amount: checkRentInvoice.totalAPayer,
                        currency: { iso: 'XOF' },
                        callback_url: 'http://localhost:4000/api/transactions/callback',
                        mode: 'mtn_open',
                        customer: {
                            //id: userTransactionLoy.id,
                            email: userTransactionLoy.email,
                            firstname: userTransactionLoy.firstname,
                            lastname: userTransactionLoy.lastname,
                            phone_number: {
                                number,
                                code: 'TG'
                            }
                        }
                    });
                    console.log("---------------------------->",
                        loyInvoicePaymentId.id, transactionFLoy.id, userTransactionElec.id

                    )
                    const transactionLoyer = await this.transactionRepository.create(
                        {
                            payment_id: loyInvoicePaymentId.id,
                            idFedapay: transactionFLoy.id,
                            referenceFedapay: transactionFLoy.reference,
                            sender_id: userTransactionElec.id,
                            transaction_type: TransactionTypeEnum.LOYER,
                            transaction_status: transactionFLoy.status,
                            transaction_reference: transactionReferenceLoy,
                            amount: transactionFLoy.amount,
                            currency: transactionFLoy.currency,
                            description: transactionFLoy.description,
                            callback_url: transactionFLoy.callback_url,
                            operation: transactionFLoy.operation,
                            payment_token: transactionFLoy.payment_token,
                            payment_url: transactionFLoy.payment_url
                        }

                    );
                    if (transactionLoyer) { return transactionLoyer };
                } catch (e) {
                    console.log("Erreur de fedapay : ", e);
                    throw new Error(e.message)
                }
                break;

            case InvoiceType.FACTURE_MAINTENANCE:
                const checkMaintenanceInvoice = await this.factureMaintenanceRepository.checkIfInvoiceNumberExist(transactionData.numero_facture);
                if (!checkMaintenanceInvoice) {
                    throw new NotFoundError("Maintenance invoice");
                }
                const mtnInvoicePaymentId = await this.paymentRepository.getPaymentWithInvoiceId(checkMaintenanceInvoice.id, InvoiceType.FACTURE_MAINTENANCE);
                const transactionReferenceMtn = await this.generateTransactionReference();

                //recuperer l'utilisateur qui effectue le paiement
                const userTransactionMtn = await this.utilisateurRepository.findById(userId);
                if (!userTransactionMtn) {
                    throw new NotFoundError("User was")
                }
                try {
                    const contacTabMtn = userTransactionMtn.phoneNumber.split(/ /g);
                    const number = contacTabMtn[1];
                    const Transaction = await this.fedapayConfig.exportFedapayEnvConfig();
                    const transactionFMtn = await Transaction.create({
                        description: `PAIEMENT DE FACTURE`,
                        amount: checkMaintenanceInvoice.totalAPayer,
                        currency: 'XOF',
                        callback_url: 'https://example.com/callback',
                        //mode: 'mtn_open',
                        customer: {
                            //id: userTransactionMtn.id,
                            email: userTransactionMtn.email,
                            firstname: userTransactionMtn.firstname,
                            lastname: userTransactionMtn.lastname,
                            phone_number: {
                                number: number,
                                code: 'TG'
                            }
                        }
                    });

                    const transactionMtn = await this.transactionRepository.create(
                        {
                            payment_id: mtnInvoicePaymentId.id,
                            idFedapay: transactionFMtn.id,
                            referenceFedapay: transactionFMtn.reference,
                            sender_id: userTransactionElec.id,
                            transaction_type: TransactionTypeEnum.LOYER,
                            transaction_status: transactionFMtn.status,
                            transaction_reference: transactionReferenceMtn,
                            amount: transactionFMtn.amount,
                            currency: transactionFMtn.currency,
                            description: transactionFMtn.description,
                            callback_url: transactionFMtn.callback_url,
                            operation: transactionFMtn.operation,
                            payment_token: transactionFMtn.payment_token,
                            payment_url: transactionFMtn.payment_url
                        }

                    );
                    if (transactionMtn) { return transactionMtn };
                } catch (e) {
                    console.log("Erreur de fedapay : ", e);
                    throw new Error(e.message)
                }
                break;
        }
    }



    async getTransactions(userId: string, role: string, page: number, limit: number): Promise<{ data: TransactionResponse[], total: number }> {
        const senderId = await this.resolveSenderId(userId, role);
        const { rows, count } = await this.transactionRepository.getTransactionPaginated(page, limit, { role, senderId });
        return {
            data: rows.map((t) => t), total: count
        };
    }

    async getTransactionById(id: string, userId: string, role: string): Promise<TransactionResponse> {
        const senderId = await this.resolveSenderId(userId, role);
        const transaction = await this.transactionRepository.findByIdWithAccess(id, { role, senderId });
        if (!transaction) {
            throw new NotFoundError("Transaction");
        }
        return transaction;
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

