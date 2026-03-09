import { InvoiceType } from '@/enums/InvoiceTypeEnume'
import { StatusAbonnementEnum } from '@/enums/StatusAbonnement'
import { z } from 'zod'

const createFactureLoyerSchema = z.object({
    numeroFacture: z.string(),
    dateEmission: z.date(),
    invoiceType: z.enum(InvoiceType),
    dateEcheance: z.date(),
    status: z.enum(StatusAbonnementEnum),
    notes: z.string(),
    isTva: z.boolean(),
    id: z.string(),
    unitLocation: z.string(),
    idTenant: z.string(),
    totalAPayer: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

const factureLoyerIdSchema = z.object({
    id: z.uuid('Invalid id for loyer'),
})

type CreateFactureLoyerSchema = z.infer<typeof createFactureLoyerSchema>
type FactureLoyerIdSchema = z.infer<typeof factureLoyerIdSchema>

export {
    CreateFactureLoyerSchema,
    FactureLoyerIdSchema,
    factureLoyerIdSchema,
    createFactureLoyerSchema
}