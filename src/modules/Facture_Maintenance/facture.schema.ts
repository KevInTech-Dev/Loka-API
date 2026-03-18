import { InvoiceType } from '@/enums/InvoiceTypeEnume'
import { StatusFactures } from '@/enums/StatusFacturesEnum'
import { z } from 'zod'

const createFactureMaintenanceSchema = z.object({
    dateEcheance: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).transform((v) => { return new Date(v) }),
    idTenant: z.string(),
    invoiceType: z.enum(InvoiceType),
    isTva: z.boolean(),
    maintenanceId: z.string(),
    notes: z.string(),
    totalAPayer: z.number(),
    status: z.enum(StatusFactures),
    unitLocation: z.string(),
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