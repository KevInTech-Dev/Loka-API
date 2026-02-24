import { z } from 'zod'


const createunitTypeSchema = z.object({
    code: z.string(),
    label: z.string(),
    isActive: z.boolean(),
})

const unitTypeIdShema = z.object({
    id: z.uuid('Invalid unit type ID format'),
})


type unitTypeIdParams = z.infer<typeof unitTypeIdShema>
type CreateUnitTypeInput = z.infer<typeof createunitTypeSchema>


export {
    createunitTypeSchema,
    unitTypeIdShema,
    unitTypeIdParams,
    CreateUnitTypeInput,
}