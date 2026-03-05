import { ContractStatusEnum } from "@/enums/ContractStatusEnum"
import { ContractTypeEnum } from "@/enums/ContractTypeEnum"
import z from "zod"

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
    deposit_paid: z.boolean(),
    rent_due_day: z.number(),
    late_fee_grace_days: z.number(),
    electricity_included: z.boolean(),
    water_included: z.boolean(),
    electricity_rate_per_kwh: z.number(),
    water_rate_per_m3: z.number(),
    other_changes: z.record(z.string(), z.any()),
    initial_electricity_reading: z.number(),
    initial_water_reading: z.number(),
    auto_renewal: z.boolean(),
    special_terms: z.string(),
    contract_document_url: z.string(),
    contract_status: z.enum(ContractStatusEnum),
    is_signed_by_landlord: z.boolean(),
    is_signed_by_tenant: z.boolean(),
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

export {
    createContractInput,
    contractIdParams,
    paginatedContract,
    createContractSchema,
    contractIdSchema,
    contractPaginationSchema,
}