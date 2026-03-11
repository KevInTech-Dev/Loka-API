import { InvoiceType } from '@/enums/InvoiceTypeEnume'
import { StatusFactures } from '@/enums/StatusFacturesEnum'
import { z } from 'zod'

const createFactureAbonnementSchema = z.object({
    landlordId: z.uuid('invalid id for the landlord id'),
    totalAPayer: z.number(),
    utilisateurAbonnement: z.uuid('invalid id for utilisateur_abonnment'),
    dateEcheance: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).transform((v) => { return new Date(v) }),
    invoiceType: z.enum(InvoiceType),
    isTva: z.boolean(),
    numeroFacture: z.string(),
    status: z.enum(StatusFactures),
    notes: z.string()
})

const factureAbonnementIdSchema = z.object({
    id: z.uuid('Invalid facture abonnement id format'),
})

type FactureAbonnementIdSchema = z.infer<typeof factureAbonnementIdSchema>
type CreateFactureAbonnementInput = z.infer<typeof createFactureAbonnementSchema>

export {
    FactureAbonnementIdSchema,
    CreateFactureAbonnementInput,
    factureAbonnementIdSchema,
    createFactureAbonnementSchema
}