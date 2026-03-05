import { GenderEnum } from "@/enums/GenderEnum";
import z from "zod";
import {createUserSchema} from "@modules/users/user.schema";
import { idCardTypeEnum } from "@/enums/idCardTypeEnum";

const paginatedTenantSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(10).default(10),
});
const createTenantSchema = createUserSchema.extend(z.object({
    date_of_birth: z.coerce.date(),
    gender: z.enum(GenderEnum),
    nationality: z.string()
        .min(1, "nationality required")
        .max(100, "Nationality must be at most 100 characters long"),
    phone_primary: z.string()
        .min(1, "Primary phone is required")
        .max(20, "Primary phone must be at most 20 characters long"),
    phone_secondary: z.string().max(20).optional(),
    id_card_type: z.enum(idCardTypeEnum),
    id_card_number: z.string(),
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

//type TenantParams = z.infer<typeof tenantIdSchema>
type CreateTenantInput = z.infer<typeof createTenantSchema> &  {
    id_card_front_url?: string,
    id_card_back_url?: string,
    photo?: string,
}


export {
    createTenantSchema,
    tenantIdSchema,
    //TenantParams,
    CreateTenantInput,
    paginatedTenantSchema,
}