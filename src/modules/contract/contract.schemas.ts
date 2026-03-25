import { ContractTypeEnum } from "@/enums/ContractTypeEnum"
import z from "zod"

const manualRenewalSchema = z.object({
    contract_start_date: z.coerce.date(),
    contract_end_date: z.coerce.date(),
})
const manualSignatureSchema = z.object({
    is_signed_by_landlord: z.coerce.boolean("La valeur doit être un boolean soit true ou false"),
    is_signed_by_tenant: z.coerce.boolean("La valeur doit être un boolean soit true ou false"),
})
const createContractSchema = z.object({
    landlord_id: z.uuid("Invalid landlord id format"),
    property_id: z.uuid("Invalid landlord id format"),
    unit_id: z.uuid("Invalid landlord id format"),
    tenant_id: z.uuid("Invalid landlord id format"),
    contract_type: z.enum(ContractTypeEnum),
    contract_start_date: z.coerce.date(),
    contract_end_date: z.coerce.date(),
    monthly_rent: z.number(),
    security_deposit: z.number(),
    rent_due_day: z.number(),
    late_fee_grace_days: z.number(),
    electricity_included: z.boolean(),
    water_included: z.boolean(),
    electricity_rate_per_kwh: z.number(),
    water_rate_per_m3: z.number(),
    other_charges: z.record(z.string(), z.any()),
    initial_electricity_reading: z.number(),
    initial_water_reading: z.number(),
    auto_renewal: z.boolean(),
    special_terms: z.string(),
});

const contractIdSchema = z.object({
    id: z.uuid("Invalid contract ID format"),
});

const contractPaginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(10),
});

type createContractInput = z.infer<typeof createContractSchema>
type contractIdParams = z.infer<typeof contractIdSchema>
type paginatedContract = z.infer<typeof contractPaginationSchema>
type manualRenawalInput = z.infer<typeof manualRenewalSchema>
type manualSignatureInput = z.infer<typeof manualSignatureSchema>

export {
    createContractInput,
    contractIdParams,
    paginatedContract,
    manualRenawalInput,
    manualSignatureInput,
    createContractSchema,
    contractIdSchema,
    contractPaginationSchema,
    manualRenewalSchema,
    manualSignatureSchema,

}