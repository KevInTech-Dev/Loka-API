import { ContractRepository } from "@modules/contract/contract.repository";
import { landLordRepository } from "../landLord/landlord.repository";
import { PropertyRepository } from "@modules/property/property.repository";
import { TenantRepository } from "@modules/tenant/tenant.repository";
import { UnitLocationRepository } from "@modules/unitLocation/unitLocation.repository";
import { MeterReadingRepository } from "@modules/meterReading/meterReading.repository";
import { CreationMeterReadingInput, UpdateMeterReadingInput } from "./meterReading.schemas";
import { MeterResponse } from "./meterReading.types";
import { MeterMapper } from "./meterReading.mapper";
import { BadRequestError, NotFoundError } from "@/common/errors";
import { MeterTypeEnum } from "@/enums/MeterTypeEnum";
import { FactureEauService } from "../Facture_Eau/facture.service";
import { FactureElectriciteService } from "../Facture_Electricite/facture.service";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { StatusFactures } from "@/enums/StatusFacturesEnum";
import { generateIvoiceNumber } from "@/common/generateInvoiceNumber";
import { FactureEauRepository } from "../Facture_Eau/facture.repository";
import { FactureElectriciteRepository } from "../Facture_Electricite/facture.repository";
import { MeterReading } from "@/database/models/meter_reading";
import { UserRepository } from "../users/user.repository";
import { PaymentService } from "../Payment/payment.service";
import { PaymentMethodEnum } from "@/enums/PaymentMethodEnum";
import { PaymentProviderEnum } from "@/enums/PaymentProviderEnum";

export class MeterReadingService {
  private meterReadingRepository: MeterReadingRepository
  private landlordRepository: landLordRepository;
  private tenantRepository: TenantRepository;
  private propertyRepository: PropertyRepository;
  private unitlocationRepository: UnitLocationRepository;
  private meterMapper: MeterMapper;
  private contractRepository: ContractRepository;
  private factureEauRepository: FactureEauRepository;
  private factureElectriciteRepository: FactureElectriciteRepository;
  private factureEauService: FactureEauService;
  private factureElectriciteService: FactureElectriciteService;
  private utilisateurRepository: UserRepository;
  private paymentService: PaymentService;


  constructor() {
    this.paymentService = new PaymentService();
    this.utilisateurRepository = new UserRepository();
    this.meterReadingRepository = new MeterReadingRepository();
    this.landlordRepository = new landLordRepository();
    this.tenantRepository = new TenantRepository();
    this.propertyRepository = new PropertyRepository();
    this.unitlocationRepository = new UnitLocationRepository();
    this.contractRepository = new ContractRepository();
    this.meterMapper = new MeterMapper();
    this.factureEauService = new FactureEauService();
    this.factureElectriciteService = new FactureElectriciteService();
    this.factureEauRepository = new FactureEauRepository();
    this.factureElectriciteRepository = new FactureElectriciteRepository();
  }

  async createMeterReading(data: CreationMeterReadingInput): Promise<MeterResponse | null> {
    const existinglandlord = await this.landlordRepository.getlandLordById(data.landlord_id);
    if (!existinglandlord) {
      throw new NotFoundError('Landlord');
    }
    const existingtenant = await this.tenantRepository.getTenantById(data.tenant_id);
    if (!existingtenant) {
      throw new NotFoundError('Tenant');
    }
    const existingProperty = await this.propertyRepository.getPropertyById(data.property_id);
    if (!existingProperty) {
      throw new NotFoundError('Property');
    }
    const existingUnitLocation = await this.unitlocationRepository.getUnitLocationById(data.unit_id);
    if (!existingUnitLocation) {
      throw new NotFoundError('Unit location');
    }

    //Verifier si il n'existe pas déjà de relevé de compteur avec les données envoyés
    const existingMeterReading = await this.meterReadingRepository.checkMeterReading(data.landlord_id, data.property_id, data.unit_id, data.tenant_id, data.meter_type, data.meter_value);
    if (existingMeterReading) {
      throw new Error("Cannot register meter reading with the same value, check datas");
    }


    const reading_date = new Date();

    const lastReading = await this.meterReadingRepository.getLatestReadingValue(
      data.unit_id,
      data.meter_type
    );
    const previousReading = lastReading ? lastReading.previous_meter_value : 0;

    const consumptionValue = data.meter_value - previousReading;

    if (consumptionValue < 0) {
      throw new BadRequestError("The new meter value cannot be lower than the old one")
    }

    const contract = await this.contractRepository.getActiveContractByUnitId(data.unit_id);

    let ratePer_unit: number;

    if (data.meter_type === 'Electricity') {
      ratePer_unit = contract.electricity_rate_per_kwh
    }
    if (data.meter_type === 'Water') {
      ratePer_unit = contract.water_rate_per_m3
    }


    const amount = consumptionValue * ratePer_unit;
    const meterReading = await this.meterReadingRepository.create(this.meterMapper.toEntity({
      ...data,
      reading_date: reading_date,
      previous_meter_value: previousReading,
      consumption: consumptionValue,
      rate_per_unit: ratePer_unit,
      amount_due: amount,
    }));

    const dateEcheance = new Date();
    dateEcheance.setDate(dateEcheance.getDate() + 15);

    if (meterReading.meter_type === MeterTypeEnum.ELECTRICITY) {
      const invoiceNumber = await this.factureElectriciteRepository.getLastInvNumber();
      const facture = await this.factureElectriciteService.createFactureElectricite({
        dateEcheance: dateEcheance,
        dateEmission: new Date(),
        idReleveCompteur: meterReading.id,
        idTenant: meterReading.tenant_id,
        invoiceType: InvoiceType.FACTURE_ELEC,
        isTva: false,
        notes: `FACTURE D'ELECTRICTE GENERÉ LE : ${new Date()}`,
        numeroFacture: generateIvoiceNumber(invoiceNumber),
        status: StatusFactures.EN_ATTENTE,
        totalAPayer: meterReading.amount_due,
        unitLocation: meterReading.unit_id
      });
      //Rechercher le locataire qui doit completer le paiement
      const tenant = await this.tenantRepository.getTenantById(facture.idTenant);
      if (!tenant) {
        throw new NotFoundError("Tenant was");
      }
      //Ensuite récuperer l'utilisateur associé au locataire
      const user = await this.utilisateurRepository.findById(tenant.userId);
      if (!user) {
        throw new NotFoundError("User was")
      }

      //Creation du paiament
      await this.paymentService.createPayment(user.id, user.role, {
        facture_type: InvoiceType.FACTURE_ELEC,
        facture_id: facture.id,
        payment_method: PaymentMethodEnum.ONLINE,
        payment_provider: PaymentProviderEnum.FEDAPAY,
        currency: "XOF",
        payer_phone: user.phoneNumber,
        payer_email: user.email,
        payment_notes: `PAIEMENT GENERER AUTOMATIQUEMENT POUR LA FACTURE D'ELECTRICITE ${facture.id}-${new Date()}`,
      })
    } else if (meterReading.meter_type === MeterTypeEnum.WATER) {
      const invoiceNumber = await this.factureEauRepository.getLastInvNumber();
      const facture = await this.factureEauService.createFactureEau({
        dateEcheance: dateEcheance,
        dateEmission: new Date(),
        idReleveCompteur: meterReading.id,
        idTenant: meterReading.tenant_id,
        invoiceType: InvoiceType.FACTURE_EAU,
        isTva: false,
        notes: `FACTURE D'EAU GENERÉ LE : ${new Date()}`,
        numeroFacture: generateIvoiceNumber(invoiceNumber),
        status: StatusFactures.EN_ATTENTE,
        totalAPayer: meterReading.amount_due,
        unitLocation: meterReading.unit_id
      });
      //Rechercher le locataire qui doit completer le paiement
      const tenant = await this.tenantRepository.getTenantById(facture.idTenant);
      if (!tenant) {
        throw new NotFoundError("Tenant was");
      }
      //Ensuite récuperer l'utilisateur associé au locataire
      const user = await this.utilisateurRepository.findById(tenant.userId);
      if (!user) {
        throw new NotFoundError("User was")
      }
      await this.paymentService.createPayment(user.id, user.role, {
        facture_type: InvoiceType.FACTURE_EAU,
        facture_id: facture.id,
        payment_method: PaymentMethodEnum.ONLINE,
        payment_provider: PaymentProviderEnum.FEDAPAY,
        currency: "XOF",
        payer_phone: user.phoneNumber,
        payer_email: user.email,
        payment_notes: `PAIEMENT GENERER AUTOMATIQUEMENT POUR LA FACTURE D'EAU ${facture.id}-${new Date()}`,
      })
    }
    return this.meterMapper.toResponse(meterReading);
  }

  async updateMeterReading(id: string, data: Partial<UpdateMeterReadingInput>): Promise<MeterResponse | null> {
    const existingMeter = await this.meterReadingRepository.findById(id);
    if (!existingMeter) {
      throw new NotFoundError("Meter reading");
    }

    // On récupère le contrat actif lié à l’unité
    const contract = await this.contractRepository.getActiveContractByUnitId(existingMeter.unit_id);
    if (!contract) {
      throw new NotFoundError("No active contract found for this unit");
    }

    const updateData: any = {};

    // Si le type change, recalcul du tarif
    if (data.meter_type !== undefined) {
      updateData.meter_type = data.meter_type;

      if (data.meter_type === "Electricity") {
        updateData.rate_per_unit = contract.electricity_rate_per_kwh;
      } else if (data.meter_type === "Water") {
        updateData.rate_per_unit = contract.water_rate_per_m3;
      } else {
        throw new BadRequestError("Invalid meter type");
      }
    }

    // Si la valeur change, recalcul consommation et montant
    if (data.meter_value !== undefined) {
      updateData.meter_value = data.meter_value;

      const previousValue = existingMeter.previous_meter_value ?? 0;
      const consumptionValue = data.meter_value - previousValue;

      if (consumptionValue < 0) {
        throw new BadRequestError("The new meter value cannot be lower than the old one");
      }

      updateData.consumption = consumptionValue;

      // Utiliser le nouveau rate_per_unit si recalculé, sinon garder l’ancien
      const rate = updateData.rate_per_unit ?? existingMeter.rate_per_unit;
      updateData.amount_due = consumptionValue * rate;
    }

    // Autres champs simples
    if (data.recorded_by_user_id !== undefined) {
      updateData.recorded_by_user_id = data.recorded_by_user_id;
    }
    if (data.reading_date !== undefined) {
      updateData.reading_date = data.reading_date;
    }

    // Mise à jour en base
    const updatedMeter = await this.meterReadingRepository.update(id, updateData);

    return this.meterMapper.toResponse(updatedMeter);
  }


  async getMeterReadingyId(id: string): Promise<MeterResponse | null> {
    const existingMeter = await this.meterReadingRepository.findById(id);
    if (!existingMeter) {
      throw new NotFoundError('Meter reading');
    }

    return {
      ...existingMeter.toJSON()
    }
  }
  async getPaginatedMeter(page: number, limit: number): Promise<MeterResponse[]> {
    return (
      await this.meterReadingRepository.getMeterReadingPaginated(page, limit)).map((meterReading) => {
        return {
          id: meterReading?.id,
          landlord_id: meterReading?.landlord_id,
          property_id: meterReading?.property_id,
          unit_id: meterReading?.unit_id,
          tenant_id: meterReading?.tenant_id,
          meter_type: meterReading?.meter_type,
          reading_date: meterReading?.reading_date,
          meter_value: meterReading?.meter_value,
          previous_meter_value: meterReading?.previous_meter_value,
          consumption: meterReading?.consumption,
          rate_per_unit: meterReading?.rate_per_unit,
          amount_due: meterReading?.amount_due,
          recorded_by_user_id: meterReading?.recorded_by_user_id,
          is_verified: meterReading?.is_verified,
          createdAt: meterReading?.createdAt,
          updatedAt: meterReading?.updatedAt,
        };
      });
  }

  async deleteMeterReading(id: string): Promise<boolean> {
    const existingMeter = await this.meterReadingRepository.delete(id);
    if (!existingMeter) {
      throw new NotFoundError('Meter reading');
    }
    return true;
  }
}