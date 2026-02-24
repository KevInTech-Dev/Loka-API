import { BusinessTypeEnum } from "@/enums/BusinessTypeEnum";
import z from "zod";

const createlandLordSchema = z.object({
    userId: z.uuid("Invalide user ID format"),
    companyName: z.string().optional(),
    businessType: z.enum(BusinessTypeEnum),
    taxId: z.string()
        .min(1, "Tax ID is required")
        .max(100, "Tax id must be at most 100 characters long"),
    phonePrimary: z.string()
        .min(1, "Primary phone is required")
        .max(20, "Primary phone must be at most 20 characters long"),
    phoneSecondary: z.string().max(20).optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
});

const landlordIdSchema = z.object({
    id: z.uuid("Invalid landlord ID format"),
});

type landLordIdParams = z.infer<typeof landlordIdSchema>
type CreateLandlordInput = z.infer<typeof createlandLordSchema>

export {
    createlandLordSchema,
    landlordIdSchema,
    landLordIdParams,
    CreateLandlordInput,
}