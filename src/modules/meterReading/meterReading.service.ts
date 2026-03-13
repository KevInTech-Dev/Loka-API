import { ContractRepository } from "@modules/contract/contract.repository";
import { landLordRepository } from "../landLord/landlord.repository";
import { PropertyRepository } from "@modules/property/property.repository";
import { TenantRepository } from "@modules/tenant/tenant.repository";
import { UnitLocationRepository } from "@modules/unitLocation/unitLocation.repository";
import { MeterReadingRepository } from "@modules/meterReading/meterReading.repository";
import { CreationMeterReadingInput } from "./meterReading.schemas";
import { MeterResponse } from "./meterReading.types";
import { MeterMapper } from "./meterReading.mapper";
import { BadRequestError, NotFoundError } from "@/common/errors";
import { MeterTypeEnum } from "@/enums/MeterTypeEnum";

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
        
        rate_per_unit
        const meterReading = await this.meterReadingRepository.create(this.meterMapper.toEntity({
            ...data,
            reading_date: reading_date,
            previous_meter_value: previousReading,
            consumption: consumptionValue,

        }));

    }

}