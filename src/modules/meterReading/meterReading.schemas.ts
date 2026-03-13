import { MeterTypeEnum } from "@/enums/MeterTypeEnum";
import z from "zod";

const CreationMeterReadingSchema = z.object({
    landlord_id: z.uuid("Invalid landlord id format"),
    property_id: z.uuid("Invalid landlord id format"),
    unit_id: z.uuid("Invalid landlord id format"),
    tenant_id: z.uuid("Invalid landlord id format"),
    meter_type: z.enum(MeterTypeEnum),
    reading_date: z.coerce.date(),
    meter_value: z.coerce.number(),
    previous_meter_value: z.coerce.number(),
    consumption: z.coerce.number(),
    rate_per_unit: z.coerce.number(),
    amount_due: z.coerce.number(),
    recorded_by_user_id: z.uuid(),
})

const MeterPaginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(1),
})

const MeterReadingIdSchema = z.object({
    id: z.uuid("Id format is invalid")
});

type MeterReadingIdParams = z.infer<typeof MeterReadingIdSchema>
type CreationMeterReadingInput = z.infer<typeof CreationMeterReadingSchema>
type PaginationMeterReading = z.infer<typeof MeterPaginationSchema>

export {
    MeterPaginationSchema,
    CreationMeterReadingSchema,
    MeterReadingIdSchema,
    MeterReadingIdParams,
    CreationMeterReadingInput,
    PaginationMeterReading,
}