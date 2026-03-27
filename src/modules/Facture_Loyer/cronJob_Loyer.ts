import cron from 'node-cron'
import { Op } from "sequelize";
import { Contract } from '@/database/models/Contracts';
import { generateIvoiceNumber } from '@/common/generateInvoiceNumber';
import { InvoiceType } from '@/enums/InvoiceTypeEnume';
import { StatusFactures } from '@/enums/StatusFacturesEnum';
import { FactureLoyerService } from './facture.service';
import { FactureLoyerRepository } from './facture.repository';
import { DuplicateEntryError, NotFoundError } from '@/common/errors';
import { PaymentService } from '../Payment/payment.service';
import { UserRepository } from '../users/user.repository';
import { PaymentMethodEnum } from '@/enums/PaymentMethodEnum';
import { PaymentProviderEnum } from '@/enums/PaymentProviderEnum';
import { TenantRepository } from '../tenant/tenant.repository';

//Initialisation des services & repository

const factureLoyerService = new FactureLoyerService();
const factureLoyerRepository = new FactureLoyerRepository();
const utilisateurRepository = new UserRepository();
const paymentService = new PaymentService();
const tenantRepository = new TenantRepository()

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
            for (const element of rentObjects) {
                const facture = await factureLoyerService.createFactureLoyer({
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
                //Rechercher le locataire qui doit completer le paiement
                const tenant = await tenantRepository.getTenantById(facture.idTenant);
                if (!tenant) {
                    throw new NotFoundError("Tenant was");
                }
                //Ensuite récuperer l'utilisateur associé au locataire
                const user = await utilisateurRepository.findById(tenant.userId);
                if (!user) {
                    throw new NotFoundError("User was")
                }
                await paymentService.createPayment(user.id, user.role, {
                    facture_type: InvoiceType.FACTURE_LOYER,
                    facture_id: facture.id,
                    payment_method: PaymentMethodEnum.ONLINE,
                    payment_provider: PaymentProviderEnum.FEDAPAY,
                    currency: "XOF",
                    payer_phone: user.phoneNumber,
                    payer_email: user.email,
                    payment_notes: `PAIEMENT GENERER AUTOMATIQUEMENT POUR LA FACTURE DE LOYER : ${facture.id}-${new Date()}`,
                })

            };

        } else {
            throw new NotFoundError("Contract with next rent due date")
        }

    })
}