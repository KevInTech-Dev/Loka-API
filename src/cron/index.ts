import {utilisateurAbonnementCronJob} from "@/modules/utilisateur_abonnement/cron_job"
import {contractCronJob} from "@/modules/contract/cronjob"

export const RunAllCron = () => {
    try {
        contractCronJob();
        utilisateurAbonnementCronJob()
    } catch (error) {
        console.error("Error occurred while running cron job:", error);
    }
}