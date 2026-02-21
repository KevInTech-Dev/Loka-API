import { BusinessTypeEnum } from "@/enums/BusinessTypeEnum";
import z from "zod";

const createlandLordSchema = z.object({
    companyName: z.string().optional(),
    businessType: z.enum(BusinessTypeEnum),
    taxId: z.string()
        .min(1, "Tax ID is required")
        .max(100, "Tax id myst be at most 100 characters long"),
    registrationNumber: z.string()
        .min(1, "Registration number is required")
        .max(100, "Registration number must be at most 100 characters long"),
    phonePrimary: z.number()
        .min(1, "Primary phone is required")
        .max(20, "Primary phone must be at most 20 characters long"),
    phoneSecondary: z.number().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
})

const landlordIdSchema = z.object({
    id: z.uuid("Invalid landlord ID format"),
})

type landLordIdParams = z.infer<typeof landlordIdSchema>
type CreateLandlordInput = z.infer<typeof createlandLordSchema>

export {
    createlandLordSchema,
    landlordIdSchema,
    landLordIdParams,
    CreateLandlordInput,
}