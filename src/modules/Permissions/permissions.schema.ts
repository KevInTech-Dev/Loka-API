import z from "zod";

const createPermissionsSchema = z.object({
    titre: z.string(),
    permission: z.string()
})

const permissionsIdSchema = z.object({
    id: z.uuid("Invalid user ID format for permissiosn id"),
})

type PermissionsIdSchema = z.infer<typeof permissionsIdSchema>
type CreatePermissionsSchema = z.infer<typeof createPermissionsSchema>

export {
    createPermissionsSchema,
    permissionsIdSchema,
    PermissionsIdSchema,
    CreatePermissionsSchema
}