import { CategoryMaintenanceRequest } from '@/enums/CategoryMaintenanceRequest'
import { Priority } from '@/enums/Priority'
import { StatutMaintenanceRequest } from '@/enums/StatutMaintenanceRequest'
import { z } from 'zod'

const createMaintenanceSchema = z.object({
    titre: z.string(),
    locataireId: z.uuid('Invalid id for locataire'),
    categorie: z.enum(CategoryMaintenanceRequest)
})

const addTechnicalManager = z.object({
    responsable: z.uuid('Invalid id for responsable'),
    statut: z.enum(StatutMaintenanceRequest),
    priority: z.enum(Priority)
})

const changeStateOfMaintenance = z.object({
    statut: z.enum([StatutMaintenanceRequest.ONGOING, StatutMaintenanceRequest.SUBMITTED]),
})

const maintenanceIdSchema = z.object({
    id: z.uuid('Invalid id for maintenance'),
})

type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>
type MaintenanceIdSchema = z.infer<typeof maintenanceIdSchema>
type AddTechnicalManager = z.infer<typeof addTechnicalManager>
type ChangeStateOfMaintenance = z.infer<typeof changeStateOfMaintenance>

export {
    CreateMaintenanceInput,
    MaintenanceIdSchema,
    AddTechnicalManager,
    ChangeStateOfMaintenance,
    addTechnicalManager,
    maintenanceIdSchema,
    createMaintenanceSchema,
    changeStateOfMaintenance
}