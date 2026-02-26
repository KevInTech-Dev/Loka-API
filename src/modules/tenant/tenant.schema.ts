import { GenderEnum } from "@/enums/GenderEnum";
import z from "zod";
import {createUserSchema} from "@modules/users/user.schema";
import { idCardTypeEnum } from "@/enums/idCardTypeEnum";

const paginatedTenantSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(10).default(10),
});
const createTenantSchema = createUserSchema.extend(z.object({
    // userId: z.uuid("Invalide user ID format"),
    date_of_birth: z.coerce.date(),
    // date_of_birth: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[0-1])$/),
    gender: z.enum(GenderEnum),
    nationality: z.string()
        .min(1, "nationality required")
        .max(100, "Nationality must be at most 100 characters long"),
    phone_primary: z.string()
        .min(1, "Primary phone is required")
        .max(20, "Primary phone must be at most 20 characters long"),
    phone_secondary: z.string().max(20).optional(),
    id_card_type: z.enum(idCardTypeEnum),
    // id_card_front_url: z.string()
    //     .min(1, "id card front url is required")
    //     .max(500, "id card front url must be at most 500 characters long"),
    // id_card_back_url: z.string()
    //     .min(1, "id card back url is required")
    //     .max(500, "id card back url must be at most 500 characters long"),
    occupation: z.string().max(200).optional(),
    employer_name: z.string().max(200).optional(),
    employer_contact: z.string().max(100).optional(),
    emergency_contact_name: z.string().max(200).optional(),
    emergency_contact_phone: z.string().max(20).optional(),
    emergency_contact_relationship: z.string().max(100).optional(),
}).shape)



const tenantIdSchema = z.object({
    id: z.uuid("Invalid tenant ID format"),
});

type TenantParams = z.infer<typeof tenantIdSchema>
type CreateTenantInput = z.infer<typeof createTenantSchema> &  {
    photo?: string
}


export {
    createTenantSchema,
    tenantIdSchema,
    TenantParams,
    CreateTenantInput,
    paginatedTenantSchema,
}