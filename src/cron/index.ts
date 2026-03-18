import { contractCronJob } from "@/modules/contract/cronjob"

export const RunAllCron  = ()=>{

    try {
        contractCronJob();
    } catch (error) {
        console.error("Error occurred while running contract cron job:", error);
    }
}