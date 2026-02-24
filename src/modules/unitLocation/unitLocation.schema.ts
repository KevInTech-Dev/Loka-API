import { z } from 'zod'


const createunitLocationSchema = z.object({
    label: z.string(),
})

const unitLocationIdShema = z.object({
    id: z.uuid('Invalid unit location ID format'),
})


type unitLocationIdParams = z.infer<typeof unitLocationIdShema>
type CreateUnitLocationInput = z.infer<typeof createunitLocationSchema>


export {
    createunitLocationSchema,
    unitLocationIdShema,
    unitLocationIdParams,
    CreateUnitLocationInput,
}