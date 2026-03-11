import { InvoiceType } from '@/enums/InvoiceTypeEnume'
import { StatusFactures } from '@/enums/StatusFacturesEnum'
import { z } from 'zod'

const createFactureElectriciteSchema = z.object({
    dateEcheance: z.date(),
    dateEmission: z.date(),
    id: z.string(),
    idReleveCompteur: z.string(),
    idTenant: z.string(),
    invoiceType: z.enum(InvoiceType),
    isTva: z.boolean(),
    notes: z.string(),
    numeroFacture: z.string(),
    status: z.enum(StatusFactures),
    totalAPayer: z.number(),
    unitLocation: z.string(),
    updatedAt: z.date(),
    createdAt: z.date(),
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