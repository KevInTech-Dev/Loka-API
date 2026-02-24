import { z } from 'zod'

const createPropertySchema = z.object({
    label: z.string(),
    type: z.uuid(),
    address: z.string(),
    city: z.string(),
    district: z.string(),
    country: z.string(),
    numberOfUnits: z.number(),
    numberOfFloors: z.number(),
    yearBuilt: z.string(),
    description: z.string(),
    electricityMeterNumber: z.string(),
    waterMeterNumber: z.string(),

})

const propertyIdShema = z.object({
    id: z.uuid('Invalid user ID format'),
})


type PropertyIdParams = z.infer<typeof propertyIdShema>
type CreatePropertyInput = z.infer<typeof createPropertySchema>


export {
    createPropertySchema,
    propertyIdShema,
    PropertyIdParams,
    CreatePropertyInput,
}