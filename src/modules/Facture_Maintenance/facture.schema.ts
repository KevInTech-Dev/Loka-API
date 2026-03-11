import { InvoiceType } from '@/enums/InvoiceTypeEnume'
import { StatusFactures } from '@/enums/StatusFacturesEnum'
import { z } from 'zod'

const createFactureMaintenanceSchema = z.object({
    createdAt: z.date(),
    dateEcheance: z.date(),
    dateEmission: z.date(),
    id: z.string(),
    idTenant: z.string(),
    invoiceType: z.enum(InvoiceType),
    isTva: z.boolean(),
    maintenanceId: z.string(),
    notes: z.string(),
    numeroFacture: z.string(),
    totalAPayer: z.number(),
    status: z.enum(StatusFactures),
    unitLocation: z.string(),
    updatedAt: z.date(),
})

const factureMaintenanceIdSchema = z.object({
    id: z.uuid('Invalid id for facture maintenance'),
})

type CreateFactureMaintenanceInput = z.infer<typeof createFactureMaintenanceSchema>
type FactureMaintenanceIdSchema = z.infer<typeof factureMaintenanceIdSchema>

export {
    CreateFactureMaintenanceInput,
    FactureMaintenanceIdSchema,
    createFactureMaintenanceSchema,
    factureMaintenanceIdSchema
}