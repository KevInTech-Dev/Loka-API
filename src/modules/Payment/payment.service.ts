import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/common/errors";
import { Contract } from "@/database/models/Contracts";
import { FactureAbonnement } from "@/database/models/FactureAbonnment";
import { FactureEau } from "@/database/models/FactureEau";
import { FactureElectricite } from "@/database/models/FactureElectricite";
import { FactureLoyer } from "@/database/models/FactureLoyer";
import { FactureMaintenance } from "@/database/models/FacturesMaintenance";
import { ContractStatusEnum } from "@/enums/ContractStatusEnum";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { PaymentProviderEnum } from "@/enums/PaymentProviderEnum";
import { PaymentStatusEnum } from "@/enums/PaymentStatusEnum";
import { TransactionTypeEnum } from "@/enums/TransactionTypeEnum";
import { landLordRepository } from "@modules/landLord/landlord.repository";
import { TenantRepository } from "@modules/tenant/tenant.repository";
import { CreatePaymentInput } from "./payment.schema";
import { Op, Transaction } from "sequelize";
import { PaymentMapper } from "./payment.mappers";
import { PaymentRepository } from "./payment.repository";
import { PaymentResponse } from "./payment.types";
import { Payment } from "@/database/models/payment";
import { TransactionRepository } from "../transaction/transaction.repository";
import env from "@/config/env";
import { RoleEnum } from "@/enums/RoleEnum";

type CurrencyCode = "XOF" | "EUR" | "USD";
const DEFAULT_CURRENCY: CurrencyCode = "XOF";

export class PaymentService {
  private paymentRepository: PaymentRepository;
  private paymentMapper: PaymentMapper;
  private landlordRepository: landLordRepository;
  private tenantRepository: TenantRepository;
  private transactionRepository: TransactionRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.paymentMapper = new PaymentMapper();
    this.landlordRepository = new landLordRepository();
    this.tenantRepository = new TenantRepository();
    this.transactionRepository = new TransactionRepository();
  }

  async createPayment(
    userId: string,
    role: string,
    paymentData: CreatePaymentInput,
    transaction?: Transaction,
  ): Promise<PaymentResponse> {
    const tenant = await this.tenantRepository.getTenantByUserId(userId);
    const landlord = await this.landlordRepository.getlandLordByUserId(userId);

    const facture = await this.paymentRepository.getFactureByTypeAndId(
      paymentData.facture_type,
      paymentData.facture_id,
      transaction,
    );

    if (!facture) {
      throw new NotFoundError("Facture");
    }

    const { tenantId, landlordId, amountPaid, factureForeignKeys } =
      await this.resolvePaymentContext(
        paymentData.facture_type,
        facture,
        tenant?.id,
        landlord?.id,
        role,
      );

    const platformCommissionRate = env.PLATFORM_COMMISSION_RATE / 100;
    const platformCommission = amountPaid * platformCommissionRate;
    const landlordAmount = amountPaid - platformCommission;

    const selectedProvider =
      paymentData.payment_provider || PaymentProviderEnum.FEDAPAY;
    const selectedCurrency = paymentData.currency || DEFAULT_CURRENCY;
    this.assertProviderCurrencyCompatibility(
      selectedProvider,
      selectedCurrency,
    );

    const paymentReference = await this.generatePaymentReference();

    const payment = await this.paymentRepository.create(
      {
        payment_reference: paymentReference,
        landlord_id: landlordId,
        tenant_id: tenantId,
        ...factureForeignKeys,
        payment_date: new Date(),
        amount_paid: amountPaid,
        currency: selectedCurrency,
        payment_method: paymentData.payment_method,
        payment_provider: selectedProvider,
        payment_status: PaymentStatusEnum.PENDING,
        factureType: paymentData.facture_type,
        platform_commission: platformCommission,
        landlord_amount: landlordAmount,
        payer_phone: paymentData.payer_phone,
        payer_email: paymentData.payer_email || "",
        receitpt_number: "",
        payment_notes: paymentData.payment_notes || "",
        refund_reason: null,
        refund_at: null,
      },
      transaction,
    );

    // const transactionReference = await this.generateTransactionReference();
    // await Transaction.create({
    //     payment_id: payment.id,
    //     landlord_id: landlordId || null,
    //     transaction_type: this.mapInvoiceTypeToTransactionType(paymentData.facture_type),
    //     transaction_status: TransactionStatusEnum.PENDING,
    //     transaction_reference: transactionReference,
    //     transaction_date: new Date(),
    //     amount: amountPaid,
    //     currency: selectedCurrency,
    //     description: `Paiement ${paymentData.facture_type}`,
    //     callback_url: null,
    //     metadata: {
    //         payment_reference: paymentReference,
    //         provider: selectedProvider,
    //     },
    // });

    return this.paymentMapper.toResponse(payment);
  }

  async getPaymentById(
    id: string,
    userId: string,
    role: string,
  ): Promise<PaymentResponse> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundError("Payment", id);
    }

    await this.assertPaymentOwnership(payment, userId, role);

    const factureId = this.getFactureIdFromPayment(
      payment.factureType,
      payment,
    );
    const factureDetails = factureId
      ? await this.paymentRepository.getFactureByTypeAndId(
          payment.factureType,
          factureId,
        )
      : null;

    return {
      ...this.paymentMapper.toResponse(payment),
      facture_details: factureDetails ? factureDetails.toJSON() : null,
    };
  }

  async getPaymentsPaginated(
    userId: string,
    role: string,
    page: number,
    limit: number,
  ): Promise<{ data: PaymentResponse[]; total: number }> {
    const { rows, count } = await this.paymentRepository.getPaymentPaginated(
      page,
      limit,
      userId,
      role,
    );
    return {
      data: rows.map((payment) => this.paymentMapper.toResponse(payment)),
      total: count,
    };
  }

  async refundPayment(id: string) {}

  private toNumber(value: unknown): number {
    return Number(value || 0);
  }

  private async resolvePaymentContext(
    factureType: InvoiceType,
    facture:
      | FactureLoyer
      | FactureEau
      | FactureElectricite
      | FactureAbonnement
      | FactureMaintenance,
    tenantIdFromUser?: string,
    landlordIdFromUser?: string,
    role?: string,
  ) {
    const emptyKeys = {
      facture_loy_id: null,
      facture_ab_id: null,
      facture_water_id: null,
      facture_elec_id: null,
      facture_mtn_id: null,
    };

    switch (factureType) {
      case InvoiceType.FACTURE_LOYER: {
        const data = facture as FactureLoyer;
        if (!tenantIdFromUser || data.idTenant !== tenantIdFromUser) {
          throw new UnauthorizedError("You cannot pay this rent invoice");
        }
        const contract = await this.getActiveContractByTenant(tenantIdFromUser);
        return {
          tenantId: tenantIdFromUser,
          landlordId: contract.landlord_id,
          amountPaid: this.toNumber(data.totalAPayer),
          factureForeignKeys: { ...emptyKeys, facture_loy_id: data.id },
        };
      }

      case InvoiceType.FACTURE_EAU: {
        const data = facture as FactureEau;
        if (!tenantIdFromUser || data.idTenant !== tenantIdFromUser) {
          throw new UnauthorizedError("You cannot pay this water invoice");
        }
        const contract = await this.getActiveContractByTenant(tenantIdFromUser);
        return {
          tenantId: tenantIdFromUser,
          landlordId: contract.landlord_id,
          amountPaid: this.toNumber(data.totalAPayer),
          factureForeignKeys: { ...emptyKeys, facture_water_id: data.id },
        };
      }

      case InvoiceType.FACTURE_ELEC: {
        const data = facture as FactureElectricite;
        if (!tenantIdFromUser || data.idTenant !== tenantIdFromUser) {
          throw new UnauthorizedError(
            "You cannot pay this electricity invoice",
          );
        }
        const contract = await this.getActiveContractByTenant(tenantIdFromUser);
        return {
          tenantId: tenantIdFromUser,
          landlordId: contract.landlord_id,
          amountPaid: this.toNumber(data.totalAPayer),
          factureForeignKeys: { ...emptyKeys, facture_elec_id: data.id },
        };
      }

      case InvoiceType.FACTURE_MAINTENANCE: {
        const data = facture as FactureMaintenance;
        if (!tenantIdFromUser || data.idTenant !== tenantIdFromUser) {
          throw new UnauthorizedError(
            "You cannot pay this maintenance invoice",
          );
        }
        const contract = await this.getActiveContractByTenant(tenantIdFromUser);
        return {
          tenantId: tenantIdFromUser,
          landlordId: contract.landlord_id,
          amountPaid: this.toNumber(data.totalAPayer),
          factureForeignKeys: { ...emptyKeys, facture_mtn_id: data.id },
        };
      }

      case InvoiceType.ABONNEMENT:
      case InvoiceType.ABONNEMENT_TRIAL: {
        const data = facture as FactureAbonnement;
        if (!landlordIdFromUser || data.landlordId !== landlordIdFromUser) {
          throw new UnauthorizedError(
            "You cannot pay this subscription invoice",
          );
        }

        if (role === "locataire") {
          throw new UnauthorizedError("Tenant cannot pay subscription invoice");
        }

        return {
          tenantId: null,
          landlordId: landlordIdFromUser,
          amountPaid: this.toNumber(data.totalAPayer),
          factureForeignKeys: { ...emptyKeys, facture_ab_id: data.id },
        };
      }

      default:
        throw new BadRequestError("Unsupported facture type");
    }
  }

  private async getActiveContractByTenant(tenantId: string) {
    const contract = await Contract.findOne({
      where: {
        tenant_id: tenantId,
        contract_status: ContractStatusEnum.ACTIVE,
      },
      attributes: ["landlord_id"],
    });

    if (!contract) {
      throw new NotFoundError("Active contract for tenant", tenantId);
    }

    return contract;
  }

  private async assertPaymentOwnership(
    payment: Payment,
    userId: string,
    role: string,
  ): Promise<void> {
    if (role === RoleEnum.ADMIN) {
      return;
    }

    if (role === RoleEnum.LOCATAIRE) {
      const tenant = await this.tenantRepository.getTenantByUserId(userId);
      if (!tenant || payment.tenant_id !== tenant.id) {
        throw new UnauthorizedError("Not authorized to view this payment");
      }
      return;
    }

    if (role === RoleEnum.PROPRIETAIRE) {
      const landlord =
        await this.landlordRepository.getlandLordByUserId(userId);
      if (!landlord || payment.landlord_id !== landlord.id) {
        throw new UnauthorizedError("Not authorized to view this payment");
      }
      return;
    }

    throw new UnauthorizedError("Role not authorized");
  }

  private getFactureIdFromPayment(
    type: InvoiceType,
    payment: Payment,
  ): string | null {
    switch (type) {
      case InvoiceType.FACTURE_LOYER:
        return payment.facture_loy_id || null;
      case InvoiceType.FACTURE_EAU:
        return payment.facture_water_id || null;
      case InvoiceType.FACTURE_ELEC:
        return payment.facture_elec_id || null;
      case InvoiceType.FACTURE_MAINTENANCE:
        return payment.facture_mtn_id || null;
      case InvoiceType.ABONNEMENT:
      case InvoiceType.ABONNEMENT_TRIAL:
        return payment.facture_ab_id || null;
      default:
        return null;
    }
  }

  private async generatePaymentReference(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const nextNumber =
      (await this.paymentRepository.countByYearMonth(year, month)) + 1;
    const paddedNumber = String(nextNumber).padStart(2, "0");

    return `PAY-${year}-${month}${paddedNumber}`;
  }

  private assertProviderCurrencyCompatibility(
    provider: PaymentProviderEnum,
    currency: CurrencyCode,
  ): void {
    const supportedCurrenciesByProvider: Record<
      PaymentProviderEnum,
      CurrencyCode[]
    > = {
      [PaymentProviderEnum.FEDAPAY]: ["XOF"],
      [PaymentProviderEnum.STRIPE]: ["XOF", "EUR", "USD"],
    };

    const supportedCurrencies = supportedCurrenciesByProvider[provider];
    if (!supportedCurrencies.includes(currency)) {
      throw new BadRequestError(
        `Currency ${currency} is not supported by provider ${provider}`,
      );
    }
  }
}
