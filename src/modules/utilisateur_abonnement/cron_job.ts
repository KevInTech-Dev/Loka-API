import { Utilisateur_Abonnement } from '@/database/models/Utilisateur_Abonnement'
import { StatusAbonnementEnum } from '@/enums/StatusAbonnement'
import cron from 'node-cron'
import { Op } from 'sequelize'
export const utilisateurAbonnementCronJob = () => {

    cron.schedule('00***', async () => {

        //Journée d'hier
        const yesterdayStart = new Date(new Date().getDate() - 1);
        yesterdayStart.setHours(0, 0, 0, 0);
        const yesterdayEnd = new Date(new Date().getDate() - 1);
        yesterdayEnd.setHours(23, 59, 59, 999)

        const abonnementExpire: Utilisateur_Abonnement[] = await Utilisateur_Abonnement.findAll({
            where: {
                endDate: {
                    [Op.gte]: yesterdayStart,
                    [Op.lte]: yesterdayEnd,

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