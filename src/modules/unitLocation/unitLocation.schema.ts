import { UnitStatusEnum } from '@/enums/UnitStatusEnum'
import { z } from 'zod'


const createUnitLocationSchema = z.object({
    unitTypeId: z.uuid(),
    unitNumber: z.string(),
    unitName: z.string(),
    floor: z.number(),
    surfaceArea: z.float64(),
    isFurnished: z.boolean(),
    electricityMeterId: z.string(),
    waterMeterId: z.string(),
    initialElectricityReading: z.float64(),
    initialWaterReading: z.float64(),
    monthlyRent: z.float64(),
    electricityIncluded: z.boolean(),
    waterIncluded: z.boolean(),
    unitStatus: z.enum(UnitStatusEnum),
    description: z.string(),
})

const unitLocationIdShema = z.object({
    id: z.uuid('Invalid unit location ID format'),
})


type unitLocationIdParams = z.infer<typeof unitLocationIdShema>
type CreateUnitLocationInput = z.infer<typeof createUnitLocationSchema>


export {
    createUnitLocationSchema,
    unitLocationIdShema,
    unitLocationIdParams,
    CreateUnitLocationInput,
}