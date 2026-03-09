import { z } from 'zod'

const createPropertyTypeSchema = z.object({
    label: z.string(),
})

const propertyTypeIdShema = z.object({
    id: z.uuid('Invalid user ID format'),
})


type PropertyTypeIdParams = z.infer<typeof propertyTypeIdShema>
type CreatePropertyTypeInput = z.infer<typeof createPropertyTypeSchema>


export {
    createPropertyTypeSchema,
    propertyTypeIdShema,
    PropertyTypeIdParams,
    CreatePropertyTypeInput,
}