import z from 'zod'
const technicalMangerSchema = z.object({
    title: z.string(),
    name: z.string(),
    contact: z.string()
})

const technicalManagerIdSchema = z.object({
    id: z.uuid('Invalid Id for the technical Manger')
})

type TechnicalManagerInput = z.infer<typeof technicalMangerSchema>;
type TechnicalManagerIdSchema = z.infer<typeof technicalManagerIdSchema>;

export {
    TechnicalManagerIdSchema,
    TechnicalManagerInput,
    technicalManagerIdSchema,
    technicalMangerSchema
}