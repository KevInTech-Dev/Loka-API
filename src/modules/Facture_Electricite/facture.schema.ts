import { InvoiceType } from '@/enums/InvoiceTypeEnume'
import { StatusFactures } from '@/enums/StatusFacturesEnum'
import { z } from 'zod'

const createFactureElectriciteSchema = z.object({
    dateEcheance: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).transform((v) => { return new Date(v) }),
    dateEmission: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).transform((v) => { return new Date(v) }),
    idReleveCompteur: z.string(),
    idTenant: z.string(),
    invoiceType: z.enum(InvoiceType),
    isTva: z.boolean(),
    notes: z.string(),
    numeroFacture: z.string(),
    status: z.enum(StatusFactures),
    totalAPayer: z.number(),
    unitLocation: z.string(),
})

const factureElectriciteIdSchema = z.object({
    id: z.uuid('Invalid id for facture electricite'),
})

type CreateFactureElectriciteInput = z.infer<typeof createFactureElectriciteSchema>
type FactureElectriciteIdSchema = z.infer<typeof factureElectriciteIdSchema>

export {
    CreateFactureElectriciteInput,
    FactureElectriciteIdSchema,
    factureElectriciteIdSchema,
    createFactureElectriciteSchema
}