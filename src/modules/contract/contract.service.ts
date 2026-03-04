import { ContractRepository } from "@modules/contract/contract.repository";
import { createContractInput } from "@modules/contract/contract.schemas";
import { contractResponse } from "@modules/contract/contract.types";
import { landLordRepository } from "@modules/landLord/landlord.repository";
import { TenantRepository } from "@modules/tenant/tenant.repository";
import { PropertyRepository } from "@modules/property/property.repository";
import { UnitLocationRepository } from "@modules/unitLocation/unitLocation.repository";
import { NotFoundError } from "@/common/errors";

export class ContractService {
    private contractRepository: ContractRepository;
    private landlordRepository: landLordRepository;
    private tenantRepository: TenantRepository;
    private propertyRepository: PropertyRepository;
    private unitlocationRepository: UnitLocationRepository;

    constructor(){
        this.contractRepository = new ContractRepository();
        this.landlordRepository = new landLordRepository();
        this.tenantRepository = new TenantRepository();
        this.propertyRepository = new PropertyRepository();
        this.unitlocationRepository = new UnitLocationRepository();
    }

    async createContract(data: createContractInput): Promise<contractResponse | null> {
        const existinglandlord = await this.landlordRepository.getlandLordById(data.landlord_id);
        if(!existinglandlord) {
            throw new NotFoundError("Landlord");
        }

        const existingtenant = await this.tenantRepository.getTenantById(data.tenant_id);
        if(!existingtenant){
            throw new NotFoundError("Tenant");
        }

        const existingProperty = await this.propertyRepository.getPropertyById(data.property_id);
        if(!existingProperty) {
            throw new NotFoundError("Property");
        }

        const existingUnitLocation = await this.unitlocationRepository.getUnitLocationById(data.unit_id);
        if(!existingUnitLocation){
            throw new NotFoundError("Unit location");
        }

      
        const contractNumber = await this.generateContractNumber()

        const contract = await this.contractRepository.createContract({
            contract_number: contractNumber,
            landlord_id: data.landlord_id,
            property_id: data.property_id,
            unit_id: data.unit_id,
            tenant_id: data.tenant_id,
            contract_type: data.contract_type,
            contract_start_date: data.contract_start_date,
            contract_end_date: data.contract_end_date,
            monthly_rent: data.monthly_rent,
            security_deposit: data.security_deposit,
            deposit_paid: data.deposit_paid,
            rent_due_day: data.rent_due_day,
            late_fee_grace_days: data.late_fee_grace_days,
            electricity_included: data.electricity_included,
            water_included: data.water_included,
            electricity_rate_per_kwh: data.electricity_rate_per_kwh,
            water_rate_per_m3: data.water_rate_per_m3,
            other_changes: JSON,
            initial_electricity_reading: data.initial_electricity_reading,
            initial_water_reading: data.initial_water_reading,
            auto_renewal: false,
            special_terms: data.special_terms,
            contract_document_url: data.contract_document_url,
            contract_status: data.contract_status,
            is_signed_by_landlord: false,
            is_signed_by_tenant: false
        })
        return {
            id: contract.id,
            contract_number: contract.contract_number,
            landlord_id: contract.landlord_id,
            property_id: contract.property_id,
            unit_id: contract.unit_id,
            tenant_id: contract.tenant_id,
            contract_type: contract.contract_type,
            contract_start_date: contract.contract_start_date,
            contract_end_date: contract.contract_end_date,
            monthly_rent: contract.monthly_rent,
            security_deposit: contract.security_deposit,
            deposit_paid: contract.deposit_paid,
            rent_due_day: contract.rent_due_day,
            late_fee_grace_days: contract.late_fee_grace_days,
            electricity_included: contract.electricity_included,
            water_included: contract.water_included,
            electricity_rate_per_kwh: contract.electricity_rate_per_kwh,
            water_rate_per_m3: contract.water_rate_per_m3,
            other_changes: contract.other_changes,
            initial_electricity_reading: contract.initial_electricity_reading,
            initial_water_reading: contract.initial_water_reading,
            auto_renewal: contract.auto_renewal,
            special_terms: contract.special_terms,
            contract_document_url: contract.contract_document_url,
            contract_status: contract.contract_status,
            is_signed_by_landlord: contract.is_signed_by_landlord,
            is_signed_by_tenant: contract.is_signed_by_tenant,
            updatedAt: contract.updatedAt,
            createdAt: contract.createdAt,
        };
    }
    async getContractById(id: string): Promise<contractResponse | null> {
        const contract = await this.contractRepository.getContractById(id);
        if(!contract) {
            throw new NotFoundError("Contract")
        }

        return {
            id: contract.id,
            contract_number: contract.contract_number,
            landlord_id: contract.landlord_id,
            property_id: contract.property_id,
            unit_id: contract.unit_id,
            tenant_id: contract.tenant_id,
            contract_type: contract.contract_type,
            contract_start_date: contract.contract_start_date,
            contract_end_date: contract.contract_end_date,
            monthly_rent: contract.monthly_rent,
            security_deposit: contract.security_deposit,
            deposit_paid: contract.deposit_paid,
            rent_due_day: contract.rent_due_day,
            late_fee_grace_days: contract.late_fee_grace_days,
            electricity_included: contract.electricity_included,
            water_included: contract.water_included,
            electricity_rate_per_kwh: contract.electricity_rate_per_kwh,
            water_rate_per_m3: contract.water_rate_per_m3,
            other_changes: contract.other_changes,
            initial_electricity_reading: contract.initial_electricity_reading,
            initial_water_reading: contract.initial_water_reading,
            auto_renewal: contract.auto_renewal,
            special_terms: contract.special_terms,
            contract_document_url: contract.contract_document_url,
            contract_status: contract.contract_status,
            is_signed_by_landlord: contract.is_signed_by_landlord,
            is_signed_by_tenant: contract.is_signed_by_tenant,
            updatedAt: contract.updatedAt,
            createdAt: contract.createdAt,
        }
    }

    async getAllContract(): Promise<contractResponse[]> {
        return (await this.contractRepository.getAllContract()).map((contract) => {
            return {
                id: contract.id,
                contract_number: contract.contract_number,
                landlord_id: contract.landlord_id,
                property_id: contract.property_id,
                unit_id: contract.unit_id,
                tenant_id: contract.tenant_id,
                contract_type: contract.contract_type,
                contract_start_date: contract.contract_start_date,
                contract_end_date: contract.contract_end_date,
                monthly_rent: contract.monthly_rent,
                security_deposit: contract.security_deposit,
                deposit_paid: contract.deposit_paid,
                rent_due_day: contract.rent_due_day,
                late_fee_grace_days: contract.late_fee_grace_days,
                electricity_included: contract.electricity_included,
                water_included: contract.water_included,
                electricity_rate_per_kwh: contract.electricity_rate_per_kwh,
                water_rate_per_m3: contract.water_rate_per_m3,
                other_changes: contract.other_changes,
                initial_electricity_reading: contract.initial_electricity_reading,
                initial_water_reading: contract.initial_water_reading,
                auto_renewal: contract.auto_renewal,
                special_terms: contract.special_terms,
                contract_document_url: contract.contract_document_url,
                contract_status: contract.contract_status,
                is_signed_by_landlord: contract.is_signed_by_landlord,
                is_signed_by_tenant: contract.is_signed_by_tenant,
                updatedAt: contract.updatedAt,
                createdAt: contract.createdAt
            };
        });
        
    }

    async getPaginatedContract(page: number, limit: number): Promise<contractResponse []> {
        return (await this.contractRepository.getlandLordPaginated(page, limit)).map(
            (contract) => {
                 return {
                    id: contract.id,
                    contract_number: contract.contract_number,
                    landlord_id: contract.landlord_id,
                    property_id: contract.property_id,
                    unit_id: contract.unit_id,
                    tenant_id: contract.tenant_id,
                    contract_type: contract.contract_type,
                    contract_start_date: contract.contract_start_date,
                    contract_end_date: contract.contract_end_date,
                    monthly_rent: contract.monthly_rent,
                    security_deposit: contract.security_deposit,
                    deposit_paid: contract.deposit_paid,
                    rent_due_day: contract.rent_due_day,
                    late_fee_grace_days: contract.late_fee_grace_days,
                    electricity_included: contract.electricity_included,
                    water_included: contract.water_included,
                    electricity_rate_per_kwh: contract.electricity_rate_per_kwh,
                    water_rate_per_m3: contract.water_rate_per_m3,
                    other_changes: contract.other_changes,
                    initial_electricity_reading: contract.initial_electricity_reading,
                    initial_water_reading: contract.initial_water_reading,
                    auto_renewal: contract.auto_renewal,
                    special_terms: contract.special_terms,
                    contract_document_url: contract.contract_document_url,
                    contract_status: contract.contract_status,
                    is_signed_by_landlord: contract.is_signed_by_landlord,
                    is_signed_by_tenant: contract.is_signed_by_tenant,
                    updatedAt: contract.updatedAt,
                    createdAt: contract.createdAt
                 };
            }
        )
       
    }

    async updateContract(id: string, data: Partial<createContractInput>): Promise<contractResponse | null> {
        const updateContract = await this.contractRepository.updateContract(id, {...data, other_changes:JSON.parse(JSON.stringify(data.other_changes))});
        if(!updateContract){
            throw new NotFoundError("Contract")
        }

        return {
                id: updateContract.id,
                contract_number: updateContract.contract_number,
                landlord_id: updateContract.landlord_id,
                property_id: updateContract.property_id,
                unit_id: updateContract.unit_id,
                tenant_id: updateContract.tenant_id,
                contract_type: updateContract.contract_type,
                contract_start_date: updateContract.contract_start_date,
                contract_end_date: updateContract.contract_end_date,
                monthly_rent: updateContract.monthly_rent,
                security_deposit: updateContract.security_deposit,
                deposit_paid: updateContract.deposit_paid,
                rent_due_day: updateContract.rent_due_day,
                late_fee_grace_days: updateContract.late_fee_grace_days,
                electricity_included: updateContract.electricity_included,
                water_included: updateContract.water_included,
                electricity_rate_per_kwh: updateContract.electricity_rate_per_kwh,
                water_rate_per_m3: updateContract.water_rate_per_m3,
                other_changes: updateContract.other_changes,
                initial_electricity_reading: updateContract.initial_electricity_reading,
                initial_water_reading: updateContract.initial_water_reading,
                auto_renewal: updateContract.auto_renewal,
                special_terms: updateContract.special_terms,
                contract_document_url: updateContract.contract_document_url,
                contract_status: updateContract.contract_status,
                is_signed_by_landlord: updateContract.is_signed_by_landlord,
                is_signed_by_tenant: updateContract.is_signed_by_tenant,
                updatedAt: updateContract.updatedAt,
                createdAt: updateContract.createdAt
        }
    }

    async deleteContract(id: string): Promise<boolean> {
        const deletedContract = await this.contractRepository.deleteContract(id);
        if(!deletedContract) {
             throw new NotFoundError("Contract");
        }
        return true;
    }   
      private  generateContractNumber = async () :Promise<string> => {
            const prefix = "CTR";
            const currentYear = new Date().getFullYear();

            const nexNumber:number = await this.contractRepository.countContract() + 1;


            const paddedNumber = String(nexNumber).padStart(3, "0");

            return `${prefix}-${currentYear}-${paddedNumber}`;
        }
    
}