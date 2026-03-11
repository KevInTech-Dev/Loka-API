import { ContractService } from "@modules/contract/contract.service";
import { ContractRepository } from "@modules/contract/contract.repository";
import cron from 'node-cron';

  const contractRepository = new ContractRepository();
  const contractService = new ContractService  
    cron.schedule("0 0 * * *", async () => {
        const today = new Date();
        console.log("Recherche des contrats expirant aujourd'hui...");

        // 1. Récupérer les contrats expirant aujourd'hui
        const contracts = await contractRepository.getContractsExpiringOn(today);

        // 2. Parcourir et renouveler
        for (const contract of contracts) {
            if (contract.auto_renewal) {
                await contractService.renewContract(contract.id);
                console.log(`Contrat ${contract.id} renouvelé automatiquement.`);
            }
        }
    });