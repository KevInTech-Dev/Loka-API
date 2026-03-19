import { Utilisateur_Abonnement } from '@/database/models/Utilisateur_Abonnement'
import { StatusAbonnementEnum } from '@/enums/StatusAbonnement'
import cron from 'node-cron'
import { Op } from 'sequelize'
export const utilisateurAbonnementCronJob = () => {

    cron.schedule('0 0 * * *', async () => {

        console.log("VERIFICATION DES ABONNEMENTS EXPIRÉS..........................")
        //Journée d'hier
        const yesterdayStart = new Date();
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        yesterdayStart.setHours(0, 0, 0, 0);
        const yesterdayEnd = new Date(yesterdayStart);
        yesterdayEnd.setHours(23, 59, 59, 999)

        const abonnementExpire: Utilisateur_Abonnement[] = await Utilisateur_Abonnement.findAll({
            where: {
                endDate: {
                    [Op.gte]: yesterdayStart,
                    [Op.lte]: yesterdayEnd
                }
            }
        });

        abonnementExpire.forEach((object) => {
            object.update(
                { status: StatusAbonnementEnum.EXPIRED },
                {
                    where: {
                        id: object.id
                    }
                }
            )
        })
    })
}