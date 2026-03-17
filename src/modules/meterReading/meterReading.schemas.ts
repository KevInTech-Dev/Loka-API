import { MeterTypeEnum } from "@/enums/MeterTypeEnum";
import { UUID } from "node:crypto";
import z from "zod";

const CreationMeterReadingSchema = z.object({
    landlord_id: z.uuid("Invalid landlord id format"),
    property_id: z.uuid("Invalid landlord id format"),
    unit_id: z.uuid("Invalid landlord id format"),
    tenant_id: z.uuid("Invalid landlord id format"),
    meter_type: z.enum(MeterTypeEnum),
    meter_value: z.coerce.number(),
})

const MeterReadingIdSchema = z.object({
    id: z.uuid("Id format is invalid")
});

type MeterReadingIdParams = z.infer<typeof MeterReadingIdSchema>
type CreationMeterReadingInput = z.infer<typeof CreationMeterReadingSchema> & {
    reading_date? : Date,
    previous_meter_value?: number,
    rate_per_unit?: number,
    amount_due?: number,
    consumption?: number,
    recorded_by_user_id?: string,
}

export {
    CreationMeterReadingSchema,
    MeterReadingIdSchema,
    MeterReadingIdParams,
    CreationMeterReadingInput,
}