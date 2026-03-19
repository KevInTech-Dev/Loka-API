import { utilisateurAbonnementCronJob } from "@/modules/utilisateur_abonnement/cron_job"

export const RunAllCron = () => {

    try {
        utilisateurAbonnementCronJob()
    } catch (e) {
        throw new Error(e);
    }

}