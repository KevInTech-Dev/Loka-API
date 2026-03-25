import cron from 'node-cron'
import { Op } from "sequelize";
import { Contract } from '@/database/models/Contracts';
import { generateIvoiceNumber } from '@/common/generateInvoiceNumber';
import { InvoiceType } from '@/enums/InvoiceTypeEnume';
import { StatusFactures } from '@/enums/StatusFacturesEnum';
import { FactureLoyerService } from './facture.service';
import { FactureLoyerRepository } from './facture.repository';
import { DuplicateEntryError, NotFoundError } from '@/common/errors';

const factureLoyerService = new FactureLoyerService();
const factureLoyerRepository = new FactureLoyerRepository();
export const loyerCronJob = () => {
    return cron.schedule("0 0 * * *", async () => {
        console.log("Exécution du cron job pour les loyers ...............................");
        const yesterdayStart = new Date();
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        yesterdayStart.setHours(0, 0, 0, 0);
        const yesterdayEnd = new Date(yesterdayStart);
        yesterdayEnd.setHours(23, 59, 59, 999)

        const rentObjects = await Contract.findAll({
            where: {
                nextRentDueDate: {
                    [Op.gte]: yesterdayStart,
                    [Op.lte]: yesterdayEnd
                }
            }
        });

        for (const rent of rentObjects) {
            const rentRetrived = await factureLoyerRepository.isFactureExistingForTenant(rent.tenant_id, rent.unit_id);

            if (rentRetrived) {
                throw new DuplicateEntryError("There already exist an invoice for today")
            }
        }


        if (rentObjects) {
            const invNumber = await factureLoyerRepository.getLastInvNumber();
            const dateEcheance = new Date();
            dateEcheance.setDate(dateEcheance.getDate() + 15);
            rentObjects.forEach(element => {
                factureLoyerService.createFactureLoyer({
                    numeroFacture: generateIvoiceNumber(invNumber),
                    dateEmission: new Date(),
                    invoiceType: InvoiceType.FACTURE_LOYER,
                    dateEcheance: dateEcheance,
                    status: StatusFactures.EN_ATTENTE,
                    notes: `FACTURE DE LOYER GENERER LE ${new Date()}`,
                    isTva: false,
                    unitLocation: element.unit_id,
                    idTenant: element.tenant_id,
                    totalAPayer: element.monthly_rent
                })
            });
        } else {
            throw new NotFoundError("Contract with next rent due date")
        }

    })
}