import { ContractRepository } from "@modules/contract/contract.repository";
import { createContractInput } from "@modules/contract/contract.schemas";
import { contractResponse } from "@modules/contract/contract.types";
import { landLordRepository } from "@modules/landLord/landlord.repository";

export class ContractService {
    private contractRepository: ContractRepository;
    private landlordRepository: landLordRepository;

    constructor(){
        this.contractRepository = new ContractRepository();
    }

    async createContract(data: createContractInput): Promise<contractResponse | null> {

        return;
    }

}