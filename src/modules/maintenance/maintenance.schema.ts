import { CategoryMaintenanceRequest } from '@/enums/CategoryMaintenanceRequest'
import { Priority } from '@/enums/Priority'
import { StatutMaintenanceRequest } from '@/enums/StatutMaintenanceRequest'
import { z } from 'zod'

const createMaintenanceSchema = z.object({
    titre: z.string(),
    locataireId: z.uuid('Invalid id for locataire'),
    categorie: z.enum(CategoryMaintenanceRequest),
    priority: z.enum(Priority),
})

const addTechnicalManager = z.object({
    responsable: z.uuid('Invalid id for responsable'),
    // date: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).transform((v) => { return new Date(v) }),
    statut: z.enum(StatutMaintenanceRequest)
})

const maintenanceIdSchema = z.object({
    id: z.uuid('Invalid id for maintenance'),
})

type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>
type MaintenanceIdSchema = z.infer<typeof maintenanceIdSchema>
type AddTechnicalManager = z.infer<typeof addTechnicalManager>

export {
    CreateMaintenanceInput,
    MaintenanceIdSchema,
    AddTechnicalManager,
    addTechnicalManager,
    maintenanceIdSchema,
    createMaintenanceSchema
}