import {ModelStatic} from "sequelize";
import {Contract, ContractCreationAttributes} from "@database/models/Contracts";
import { NotFoundError } from "@/common/errors";
import {LandLord} from '@database/models/landLord'
import { Tenant } from "@/database/models/Tenants";
import { Property } from "@/database/models/Property";
import { UnitLocation } from "@/database/models/UnitLocation";
export class ContractRepository {
    
    private contract: ModelStatic<Contract>

    constructor() {
        this.contract = Contract;
    }
    
    async getAllContract(){
        return this.contract.findAll();
    }

    async getContractPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.contract.findAll({ offset, limit , include: [
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
                as: 'contractUnit'
            }
        ]});
    }
    async createContract(data: ContractCreationAttributes) {
        return this.contract.create(data);
    }

    async getContractById(id: string){
        return this.contract.findByPk(id, {include:[
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
                as: 'contractUnit'
            }
        ]}
        );
    }

    async updateContract(id: string, data: Partial<ContractCreationAttributes>){
        const contract = await this.getContractById(id);
        if(!contract) throw new NotFoundError("Contract");

        await contract.update(data);
        return contract;
    }

    async deleteContract(id: string) {
        const contract = await this.getContractById(id);
        if(!contract) throw new NotFoundError("Contract");

        await contract.destroy();
        return true;
    }

    countContract():Promise<number> {
        return this.contract.count({paranoid:false})
    }
}