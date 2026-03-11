import { MeterTypeEnum } from "@/enums/MeterTypeEnum";
import z from "zod";

const CreationMeterReadingSchema = z.object({
    meter_type: z.enum(MeterTypeEnum),
    reading_date: z.coerce.date(),
    meter_value: z.number
})