import { BaseMapper } from "@/common/mapper/base.mapper";
import { MeterReading } from "@/database/models/meter_reading";
import { MeterTypeEnum } from "@/enums/MeterTypeEnum";
import { MeterResponse } from "@modules/meterReading/meterReading.types";
import { CreationMeterReadingInput } from "@modules/meterReading/meterReading.schemas";

export class MeterMapper implements BaseMapper<MeterReading, MeterResponse> {
    toResponse(meterReading: MeterReading): MeterResponse {
        return {
            id: meterReading?.id || '',
            landlord_id: meterReading?.landlord_id || '',
            property_id: meterReading?.property_id || '',
            unit_id: meterReading?.unit_id || '',
            tenant_id: meterReading?.tenant_id || '',
            meter_type: meterReading?.meter_type || MeterTypeEnum.ELECTRICITY,
            reading_date: meterReading?.reading_date,
            meter_value: meterReading?.meter_value,
            previous_meter_value: meterReading?.previous_meter_value,
            consumption: meterReading?.consumption,
            rate_per_unit: meterReading?.rate_per_unit,
            amount_due: meterReading?.amount_due ,
            recorded_by_user_id: meterReading?.recorded_by_user_id || '',
            is_verified: meterReading?.is_verified || false,
            createdAt: meterReading?.createdAt,
            updatedAt: meterReading?.updatedAt,
        }
    }

    toEntity(data: CreationMeterReadingInput): Partial<MeterReading> {
        return {
            landlord_id: data?.landlord_id,
            property_id: data?.property_id,
            unit_id: data?.unit_id,
            tenant_id: data?.tenant_id,
            meter_type: data?.meter_type,
            reading_date: data?.reading_date,
            meter_value: data?.meter_value,
            previous_meter_value: data?.previous_meter_value,
            consumption: data?.consumption,
            rate_per_unit: data?.rate_per_unit,
            amount_due: data?.amount_due,
            recorded_by_user_id: data?.recorded_by_user_id,
            is_verified: false,
        }
    }
}