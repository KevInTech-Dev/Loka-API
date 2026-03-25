import { utilisateurAbonnementCronJob } from "@/modules/utilisateur_abonnement/cron_job"
import { contractCronJob } from "@/modules/contract/cronjob"
import { loyerCronJob } from "@/modules/Facture_Loyer/cronJob_Loyer";

export const RunAllCron = () => {
    try {
        contractCronJob();
        utilisateurAbonnementCronJob();
        loyerCronJob();
    } catch (error) {
        console.error("Error occurred while running cron job:", error);
    }
}