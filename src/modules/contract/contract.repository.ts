import {ModelStatic} from "sequelize";
import {Contract, ContractCreationAttributes} from "@database/models/Contracts";
import { NotFoundError } from "@/common/errors";

export class ContractRepository {
    
    private contract: ModelStatic<Contract>

    constructor() {
        this.contract = Contract;
    }
    
    async getAllContract(){
        return this.contract.findAll();
    }

    async getlandLordPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.contract.findAll({ offset, limit });
    }
    async createContract(data: ContractCreationAttributes) {
        return this.contract.create(data);
    }

    async getContractById(id: string){
        return this.contract.findByPk(id);
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