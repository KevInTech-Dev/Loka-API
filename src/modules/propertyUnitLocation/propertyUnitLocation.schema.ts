import { z } from 'zod'


const createpropertyUnitLocationSchema = z.object({
    label: z.string(),
})

const propertyUnitLocationIdShema = z.object({
    id: z.uuid('Invalid property_unit_location ID format'),
})


type propertyUnitLocationIdParams = z.infer<typeof propertyUnitLocationIdShema>
type CreatepropertyUnitLocationInput = z.infer<typeof createpropertyUnitLocationSchema>


export {
    createpropertyUnitLocationSchema,
    propertyUnitLocationIdShema,
    propertyUnitLocationIdParams,
    CreatepropertyUnitLocationInput,
}