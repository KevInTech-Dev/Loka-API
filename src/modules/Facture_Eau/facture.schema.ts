import { InvoiceType } from '@/enums/InvoiceTypeEnume'
import { StatusAbonnementEnum } from '@/enums/StatusAbonnement'
import { z } from 'zod'

const creationFactureEauSchema = z.object({
    dateEcheance: z.date(),
    dateEmission: z.date(),
    idReleveCompteur: z.string(),
    idTenant: z.string(),
    invoiceType: z.enum(InvoiceType),
    isTva: z.boolean(),
    notes: z.string(),
    numeroFacture: z.string(),
    status: z.enum(StatusAbonnementEnum),
    totalAPayer: z.number(),
    unitLocation: z.string()
})

const factureEauIdSchema = z.object({
    id: z.uuid('invalid Id for facture eau'),
})

type CreateFactureEauInput = z.infer<typeof creationFactureEauSchema>
type FactureEauIdSchema = z.infer<typeof factureEauIdSchema>

export {
    CreateFactureEauInput,
    FactureEauIdSchema,
    factureEauIdSchema,
    creationFactureEauSchema
}