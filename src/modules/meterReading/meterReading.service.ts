import { ContractRepository } from "@modules/contract/contract.repository";
import { landLordRepository } from "../landLord/landlord.repository";
import { PropertyRepository } from "@modules/property/property.repository";
import { TenantRepository } from "@modules/tenant/tenant.repository";
import { UnitLocationRepository } from "@modules/unitLocation/unitLocation.repository";
import { MeterReadingRepository } from "@modules/meterReading/meterReading.repository";
import { CreationMeterReadingInput } from "./meterReading.schemas";
import { MeterResponse } from "./meterReading.types";
import { MeterMapper } from "./meterReading.mapper";
import { BadRequestError, InternalServerError, NotFoundError } from "@/common/errors";
import { Request } from "express";

export class MeterReadingService {
    private meterReadingRepository: MeterReadingRepository
    private landlordRepository: landLordRepository;
    private tenantRepository: TenantRepository;
    private propertyRepository: PropertyRepository;
    private unitlocationRepository: UnitLocationRepository;
    private meterMapper: MeterMapper;
    private contractRepository: ContractRepository;

    
    constructor() {
        this.meterReadingRepository = new MeterReadingRepository();
        this.landlordRepository = new landLordRepository();
        this.tenantRepository = new TenantRepository();
        this.propertyRepository = new PropertyRepository();
        this.unitlocationRepository = new UnitLocationRepository();
        this.contractRepository = new ContractRepository();
        this.meterMapper = new MeterMapper();
      }
    
    async createMeterReading(data: CreationMeterReadingInput): Promise<MeterResponse | null > {
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
        const reading_date = new Date();

        const lastReading = await this.meterReadingRepository.getLatestReadingValue(
                data.unit_id,
                data.meter_type
           );
        const previousReading = lastReading ? lastReading.previous_meter_value : 0;
        
        const consumptionValue = data.meter_value - previousReading;
        
        if(consumptionValue < 0){
            throw new BadRequestError("The new meter value cannot be lower than the old one")
        }
        
        const contract = await this.contractRepository.getActiveContractByUnitId(data.unit_id);

        let ratePer_unit: number;

        if(data.meter_type === 'Electricity'){
          ratePer_unit = contract.electricity_rate_per_kwh
        }
        if(data.meter_type === 'Water'){
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

        return this.meterMapper.toResponse(meterReading);
    }

    async updateMeterReading(id: string, data: Partial<CreationMeterReadingInput>): Promise<MeterResponse | null> {
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
      if(!existingMeter){
        throw new NotFoundError('Meter reading');
      }

      return {
          ...existingMeter.toJSON()
      }
    }
    async getPaginatedMeter(page: number, limit: number): Promise<MeterResponse[]> {
      return(
        await this.meterReadingRepository.getMeterReadingPaginated(page, limit)).map((meterReading) =>  {
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

    async deleteMeterReading(id: string): Promise<boolean>{
      const existingMeter = await this.meterReadingRepository.delete(id);
      if(!existingMeter){
        throw new NotFoundError('Meter reading');
      }
      return true;
    }
}