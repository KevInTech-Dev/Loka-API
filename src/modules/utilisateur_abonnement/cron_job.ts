import { Utilisateur_Abonnement } from '@/database/models/Utilisateur_Abonnement'
import { StatusAbonnementEnum } from '@/enums/StatusAbonnement'
import cron from 'node-cron'
import { Op } from 'sequelize'
export const utilisateurAbonnementCronJob = () => {

    cron.schedule('00***', async () => {
        const today = new Date()
        const abonnementExpire: Utilisateur_Abonnement[] = await Utilisateur_Abonnement.findAll({
            where: {
                endDate: {
                    [Op.lt]: today,
                    [Op.gt]: today.setDate(new Date().getDate() - 1)
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