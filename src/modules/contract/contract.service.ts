import { ContractRepository } from '@modules/contract/contract.repository';
import { createContractInput, manualRenawalInput, manualSignatureInput } from '@modules/contract/contract.schemas';
import { contractResponse } from '@modules/contract/contract.types';
import { landLordRepository } from '@modules/landLord/landlord.repository';
import { TenantRepository } from '@modules/tenant/tenant.repository';
import { PropertyRepository } from '@modules/property/property.repository';
import { UnitLocationRepository } from '@modules/unitLocation/unitLocation.repository';
import { InternalServerError, NotFoundError } from '@/common/errors';
import { ContractStatusEnum } from '@/enums/ContractStatusEnum';
import { deleteFile, fileExists } from '@/utils/file.utils';

export class ContractService {
  private contractRepository: ContractRepository;
  private landlordRepository: landLordRepository;
  private tenantRepository: TenantRepository;
  private propertyRepository: PropertyRepository;
  private unitlocationRepository: UnitLocationRepository;

  constructor() {
    this.contractRepository = new ContractRepository();
    this.landlordRepository = new landLordRepository();
    this.tenantRepository = new TenantRepository();
    this.propertyRepository = new PropertyRepository();
    this.unitlocationRepository = new UnitLocationRepository();
  }

  async createContract(data: createContractInput): Promise<contractResponse | null> {
    const existinglandlord = await this.landlordRepository.getlandLordById(data.landlord_id);
    if (!existinglandlord) {
      throw new NotFoundError('Landlord');
    }

    const existingtenant = await this.tenantRepository.getTenantById(data.tenant_id);
    if (!existingtenant) {
      throw new NotFoundError('Tenant');
    }

    const existingProperty = await this.propertyRepository.getPropertyById(data.property_id);
    if (!existingProperty) {
      throw new NotFoundError('Property');
    }

    const existingUnitLocation = await this.unitlocationRepository.getUnitLocationById(data.unit_id);
    if (!existingUnitLocation) {
      throw new NotFoundError('Unit location');
    }

    const contractNumber = await this.generateContractNumber();
    //Génerer la prochaine date pour avoir une facture de loyer à dans 30 jours = 1 mois
    const nextRentDueDate = data.contract_start_date;
    nextRentDueDate.setDate(nextRentDueDate.getDate() + 30);
    const contract = await this.contractRepository.createContract({
      contract_number: contractNumber,
      landlord_id: data.landlord_id,
      property_id: data.property_id,
      nextRentDueDate: nextRentDueDate,
      unit_id: data.unit_id,
      tenant_id: data.tenant_id,
      contract_type: data.contract_type,
      contract_start_date: data.contract_start_date,
      contract_end_date: data.contract_end_date,
      monthly_rent: data.monthly_rent,
      security_deposit: data.security_deposit,
      deposit_paid: false,
      rent_due_day: data.rent_due_day,
      late_fee_grace_days: data.late_fee_grace_days,
      electricity_included: data.electricity_included,
      water_included: data.water_included,
      electricity_rate_per_kwh: data.electricity_rate_per_kwh,
      water_rate_per_m3: data.water_rate_per_m3,
      other_charges: JSON,
      initial_electricity_reading: data.initial_electricity_reading,
      initial_water_reading: data.initial_water_reading,
      auto_renewal: false,
      special_terms: data.special_terms,
      contract_status: ContractStatusEnum.DRAFT,
      is_signed_by_landlord: false,
      is_signed_by_tenant: false,
    });
    return {
      ...contract.toJSON()
    };
  }
  async getContractById(id: string): Promise<contractResponse | null> {
    const contract = await this.contractRepository.getContractById(id);
    if (!contract) {
      throw new NotFoundError('Contract');
    }

    return {
      ...contract.toJSON(),
      is_signed_by_landlord: !!contract.landlord_signature_url || contract.is_signed_by_landlord,
      is_signed_by_tenant: !!contract.tenant_signature_url || contract.is_signed_by_tenant,
    };
  }

  async getAllContract(): Promise<contractResponse[]> {
    return (await this.contractRepository.getAllContract()).map((contract) => {
      return {
        ...contract.toJSON(),
        is_signed_by_landlord: !!contract.landlord_signature_url || contract.is_signed_by_landlord,
        is_signed_by_tenant: !!contract.tenant_signature_url || contract.is_signed_by_tenant,
      };
    });
  }

  async getPaginatedContract(page: number, limit: number): Promise<contractResponse[]> {
    return (
      await this.contractRepository.getContractPaginated(page, limit)).map((contract) => {
        return {
          ...contract.toJSON(),
          is_signed_by_landlord: !!contract.landlord_signature_url || contract.is_signed_by_landlord,
          is_signed_by_tenant: !!contract.tenant_signature_url || contract.is_signed_by_tenant,
        };
      });
  }
  async uploadContractDocUrl(id: string, files: { tenant?: Express.Multer.File; landlord?: Express.Multer.File }) {
    const contract = await this.getContractById(id);
    if (!contract) {
      throw new NotFoundError('Contract');
    }

    const uploadData: any = {};
    if (files.landlord) {
      if (contract.landlord_signature_url && fileExists(contract.landlord_signature_url)) {
        deleteFile(contract.landlord_signature_url);
      }
      uploadData.landlord_signature_url = files.landlord.path;
      uploadData.is_signed_by_landlord = true;
    }
    if (files.tenant) {
      if (
        contract.tenant_signature_url &&
        fileExists(contract.tenant_signature_url)
      ) {
        deleteFile(contract.tenant_signature_url);
      }
      uploadData.tenant_signature_url = files.tenant.path;
      uploadData.is_signed_by_tenant = true;
    }
    return await this.contractRepository.updateContract(id, uploadData);
  }
  async updateContract(id: string, data: Partial<createContractInput>): Promise<contractResponse | null> {
    const existingContract = await this.contractRepository.getContractById(id);
    if (!existingContract) {
      throw new NotFoundError('Contract');
    }
    const updateContract = await this.contractRepository.updateContract(id, {
      ...data,
      other_charges: JSON.parse(JSON.stringify(data.other_charges)),
    });
    if (!updateContract) {
      throw new InternalServerError('Error while updating the contract');
    }
    if (updateContract.is_signed_by_landlord === true || updateContract.is_signed_by_tenant === true) {
      throw new Error('Contract is already signed');
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
      other_charges: updateContract.other_charges,
      initial_electricity_reading: updateContract.initial_electricity_reading,
      initial_water_reading: updateContract.initial_water_reading,
      auto_renewal: updateContract.auto_renewal,
      special_terms: updateContract.special_terms,
      contract_status: updateContract.contract_status,
      is_signed_by_landlord: updateContract.is_signed_by_landlord,
      is_signed_by_tenant: updateContract.is_signed_by_tenant,
      updatedAt: updateContract.updatedAt,
      createdAt: updateContract.createdAt,
    };
  }

  async deleteContract(id: string): Promise<boolean> {
    const deletedContract = await this.contractRepository.deleteContract(id);
    if (!deletedContract) {
      throw new NotFoundError('Contract');
    }
    return true;
  }
  private generateContractNumber = async (): Promise<string> => {
    const prefix = 'CTR';
    const currentYear = new Date().getFullYear();

    const nexNumber: number =
      (await this.contractRepository.countContract()) + 1;

    const paddedNumber = String(nexNumber).padStart(3, '0');

    return `${prefix}-${currentYear}-${paddedNumber}`;
  };
  async renewContract(id: string) {
    const existingContract = await this.contractRepository.getContractById(id);
    try {
      if (!existingContract) {
        throw new Error('Contract');
      }
      if (!existingContract.auto_renewal) {
        throw new Error('Auto renewal is disabled and contract status is not active');
      }
      if (existingContract.contract_status != ContractStatusEnum.ACTIVE) {
        throw new Error('The contract status is not active');
      }
    } catch (error) {
      throw new Error(error)
    }

    // Calcul de la durée initiale
    const startDate = new Date(existingContract.contract_start_date);
    const endDate = new Date(existingContract.contract_end_date);
    const durationMs = endDate.getTime() - startDate.getTime();

    // Nouvelle date de début = fin de l’ancien
    const newStartDate = new Date(endDate);

    // Nouvelle date de fin = même durée que l’ancien
    const newEndDate = new Date(newStartDate.getTime() + durationMs);

    // Création du nouveau contrat
    const renewedContract = await this.contractRepository.createContract({
      ...existingContract.toJSON(),
      contract_number: await this.generateContractNumber(),
      contract_start_date: newStartDate,
      contract_end_date: newEndDate,
      is_signed_by_landlord: true,
      is_signed_by_tenant: true,
    });
    await this.contractRepository.updateContract(id, { contract_status: ContractStatusEnum.EXPIRED });
    return renewedContract;
  }
  async manualRenewal(id: string, data: manualRenawalInput) {
    const existingContract = await this.contractRepository.getContractById(id);
    if (!existingContract) {
      throw new NotFoundError('Contract');
    }

    if (existingContract.auto_renewal) {
      throw new Error('Auto-renewal is activated, manual renewal not allowed');
    }

    if (existingContract.contract_status !== ContractStatusEnum.ACTIVE) {
      throw new Error('The contract status is not active');
    }
    const today = new Date();
    const contractEndDate = new Date(existingContract.contract_end_date);

    if (contractEndDate > today) {
      throw new Error("Contract has not expired yet");
    }
    const contractNumber = await this.generateContractNumber();
    await this.contractRepository.updateContract(id, { contract_status: ContractStatusEnum.EXPIRED })
    const manualRenawalContract = await this.contractRepository.createContract({
      ...existingContract.toJSON(),
      contract_number: contractNumber,
      contract_start_date: data.contract_start_date,
      contract_end_date: data.contract_end_date,
      is_signed_by_landlord: false,
      is_signed_by_tenant: false,
      contract_status: ContractStatusEnum.DRAFT,
      auto_renewal: false,
      tenant_signature_url: undefined,
      landlord_signature_url: undefined
    });

    return manualRenawalContract;

  }

  async signconract(id: string, data: Partial<manualSignatureInput>) {
    const existingContract = await this.contractRepository.getContractById(id);
    if (!existingContract) {
      throw new NotFoundError("Contract");
    }
    const updateData: any = {};
    if (data.is_signed_by_landlord) {
      updateData.is_signed_by_landlord = data.is_signed_by_landlord
    }
    if (data.is_signed_by_tenant) {
      updateData.is_signed_by_tenant = data.is_signed_by_tenant
    }
    if (updateData.is_signed_by_landlord == true && updateData.is_signed_by_tenant == true) {
      updateData.contract_status = ContractStatusEnum.ACTIVE
    }
    const updateContract = await this.contractRepository.updateContract(id, updateData);

    return {
      ...updateContract.toJSON(),
      is_signed_by_tenant: !!updateContract.tenant_signature_url || updateContract.is_signed_by_tenant,
      is_signed_by_landlord: !!updateContract.landlord_signature_url || updateContract.is_signed_by_landlord,
    }
  }

  async terminateContract(id: string) {
    const existingContract = await this.contractRepository.getContractById(id);
    if (!existingContract) {
      throw new NotFoundError("Contract");
    }
    const updateContract = await this.contractRepository.updateContract(id, { ...existingContract, contract_status: ContractStatusEnum.TERMINATED });

    return {
      ...updateContract.toJSON(),
    }
  }
}
