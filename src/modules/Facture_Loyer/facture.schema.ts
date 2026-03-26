import { InvoiceType } from '@/enums/InvoiceTypeEnume'
import { StatusFactures } from '@/enums/StatusFacturesEnum'
import { z } from 'zod'

const createFactureLoyerSchema = z.object({
    numeroFacture: z.string(),
    dateEmission: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).transform((v) => { return new Date(v) }),
    invoiceType: z.enum(InvoiceType),
    dateEcheance: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).transform((v) => { return new Date(v) }),
    status: z.enum(StatusFactures),
    notes: z.string(),
    isTva: z.boolean(),
    unitLocation: z.string(),
    idTenant: z.uuid(),
    totalAPayer: z.number(),
})

const factureLoyerIdSchema = z.object({
    id: z.uuid('Invalid id for loyer'),
})

type CreateFactureLoyerInput = z.infer<typeof createFactureLoyerSchema>
type FactureLoyerIdSchema = z.infer<typeof factureLoyerIdSchema>

export {
    CreateFactureLoyerInput,
    FactureLoyerIdSchema,
    factureLoyerIdSchema,
    createFactureLoyerSchema
}