import { InvoiceType } from '@/enums/InvoiceTypeEnume'
import { StatusAbonnementEnum } from '@/enums/StatusAbonnement'
import { StatusFactures } from '@/enums/StatusFacturesEnum'
import { z } from 'zod'

const creationFactureEauSchema = z.object({
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