import { BaseTypes } from "@/common/models/base.model";
import { MeterTypeEnum } from "@/enums/MeterTypeEnum";

export type MeterResponse = BaseTypes & {
    landlord_id: string;
    property_id: string;
    unit_id: string;
    tenant_id: string;
    meter_type: MeterTypeEnum;
    reading_date: Date;
    meter_value: number;
    previous_meter_value: number;
    consumption: number;
    rate_per_unit: number;
    amount_due: number;
    recorded_by_user_id: string;
    is_verified: boolean;
}