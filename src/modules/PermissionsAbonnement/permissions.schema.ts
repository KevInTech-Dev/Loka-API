import z from "zod";

const createPermissionsAbonnementSchema = z.object({
    idAbonnement: z.uuid(),
    idPermission: z.uuid()
})

const permissionsAbonnementIdSchema = z.object({
    id: z.uuid("Invalid id format for permissions abonnement id")
})

type PermissionsAbonnementSchema = z.infer<typeof createPermissionsAbonnementSchema>
type PermissionsAbonnementIdSchema = z.infer<typeof permissionsAbonnementIdSchema>

export {
    createPermissionsAbonnementSchema,
    permissionsAbonnementIdSchema,
    PermissionsAbonnementIdSchema,
    PermissionsAbonnementSchema
}
