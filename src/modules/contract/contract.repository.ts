import { ModelStatic } from 'sequelize';
import { Contract, ContractCreationAttributes } from '@database/models/Contracts';
import { NotFoundError } from '@/common/errors';
import { LandLord } from '@database/models/landLord';
import { Tenant } from '@/database/models/Tenants';
import { Property } from '@/database/models/Property';
import { UnitLocation } from '@/database/models/UnitLocation';
import { ContractStatusEnum } from '@/enums/ContractStatusEnum';

export class ContractRepository {
    
  private contract: ModelStatic<Contract>;

  constructor() {
    this.contract = Contract;
  }

  async getAllContract() {
    return this.contract.findAll();
  }

  async getContractPaginated(page: number, limit: number) {
    const offset = (page - 1) * limit;
    return this.contract.findAll({
      offset,
      limit,
      include: [
        {
          model: LandLord,
          as: 'contractLandlord',
        },
        {
          model: Tenant,
          as: 'contractTenant',
        },
        {
          model: Property,
          as: 'contractProperty',
        },
        {
          model: UnitLocation,
          as: 'contractUnit',
        },
      ],
    });
  }
  async createContract(data: ContractCreationAttributes) {
    delete data.id;
    return this.contract.create(data);
  }

  async getContractById(id: string):Promise<Contract |null> {
    return await this.contract.findByPk(id, {
      include: [
        {
          model: LandLord,
          as: 'contractLandlord',
        },
        {
          model: Tenant,
          as: 'contractTenant',
        },
        {
          model: Property,
          as: 'contractProperty',
        },
        {
          model: UnitLocation,
          as: 'contractUnit',
        },
      ],
    });
  }

  async updateContract(id: string, data: Partial<ContractCreationAttributes>) {
    const contract = await this.getContractById(id);
    if (!contract) throw new NotFoundError('Contract');

    await contract.update(data, {
      where:{
        id : data.id
      }
    });
    return contract;
  }

  async deleteContract(id: string) {
    const contract = await this.getContractById(id);
    if (!contract) throw new NotFoundError('Contract');

    await contract.destroy();
    return true;
  }

  countContract(): Promise<number> {
    return this.contract.count({ paranoid: false });
  }

  async getActiveContractByUnitId(unit_id: string) {
    return await this.contract.findOne({
      where: {
        unit_id: unit_id,
        contract_status: ContractStatusEnum.ACTIVE
      }
    });
  }
  // // Récupérer les contrats qui expirent hier
  //   async getContractsExpiringOn(date) {
  //       const yyyy = date.getFullYear();
  //       const mm = String(date.getMonth() + 1).padStart(2, "0");
  //       const dd = String(date.getDate()).padStart(2, "0");

  //       const todayStr = `${yyyy}-${mm}-${dd}`;
  //       const today = new Date(todayStr);
  //       return await this.contract.findAll({
  //           where: {
  //               contract_end_date: today
  //           }
  //       });
  //     }
}
