import { ContractService } from "@modules/contract/contract.service";
import { ContractRepository } from "@modules/contract/contract.repository";
import cron from 'node-cron';
import { Op } from "sequelize";
import { Contract } from "@/database/models/Contracts";

//   const contractRepository = new ContractRepository();
  const contractService = new ContractService()  
 export const  contractCronJob = ()=>{
    console.log("cron contract run")
      return cron.schedule("0 0 * * *", async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0); 
        console.log("Les contrats expirant hier:", yesterday)
        const yesterdayEnd = new Date(yesterday);
        yesterdayEnd.setHours(23, 59, 59, 999);
        
        const contracts = await Contract.findAll({
            where: {
                contract_end_date: {
                    [Op.gte]: yesterday,
                    [Op.lte]: yesterdayEnd
                }
            }
        });
        for (const contract of contracts) {
            if (contract.auto_renewal) {
                await contractService.renewContract(contract.id);
                console.log(`Contrat ${contract.contract_number} renouvelé automatiquement.`);
            }
        }
        });
}