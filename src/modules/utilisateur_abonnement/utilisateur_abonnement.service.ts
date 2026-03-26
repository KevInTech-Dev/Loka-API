import { Utilisateur_AbonnementRepository } from "./utilisateur_abonnement.repository";
import { Utilisateur_Abonnement } from "@database/models/Utilisateur_Abonnement";
import { UtilisateurAbonnementAttributes } from "@database/models/Utilisateur_Abonnement";
import { AbonnementRepository } from "../abonnements/abonnement.repository";
import { UserRepository } from "../users/user.repository";
import { ForbiddenError, NotFoundError } from "@/common/errors";
import { PlanAbonnementEnum } from "@/enums/PlanAbonnementEnum";
import { StatusAbonnementEnum } from "@/enums/StatusAbonnement";
import { FactureAbonnementService } from "../Facture_Abonnement/facture.service";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { FactureAbonnementRepository } from "../Facture_Abonnement/facture.repository";
import { generateIvoiceNumber } from "@/common/generateInvoiceNumber";
import { StatusFactures } from "@/enums/StatusFacturesEnum";
import { Transaction } from "sequelize";
import { RoleEnum } from "@/enums/RoleEnum";
import { PaymentService } from "../Payment/payment.service";
import { PaymentMethodEnum } from "@/enums/PaymentMethodEnum";
import { PaymentProviderEnum } from "@/enums/PaymentProviderEnum";

export class Utilisateur_AbonnementService {
    private repository: Utilisateur_AbonnementRepository;
    private abonnementRepository: AbonnementRepository;
    private utilisateurRepository: UserRepository;
    private factureAbonnementService: FactureAbonnementService;
    private factureAbonnementRepository: FactureAbonnementRepository;
    private paymentService: PaymentService;

    constructor() {
        this.repository = new Utilisateur_AbonnementRepository();
        this.abonnementRepository = new AbonnementRepository();
        this.utilisateurRepository = new UserRepository();
        this.factureAbonnementService = new FactureAbonnementService();
        this.factureAbonnementRepository = new FactureAbonnementRepository();
        this.paymentService = new PaymentService()
    }

    /**
     * Crée une nouvelle relation utilisateur-abonnement
    */
    async create(data: UtilisateurAbonnementAttributes, userId?: string, role?: string): Promise<Utilisateur_Abonnement> {
        let transaction: Transaction;
        let response;
        //Verifier le type d'abonnement
        const checkSubType = await this.abonnementRepository.findById(data.abonnementId);
        if (!checkSubType) {
            throw new NotFoundError("This subscription");
        }
        //Verifier si l'utilisateur existe
        const existingUserSubs = await this.utilisateurRepository.findById(data.utilisateurId);
        console.log("user ", (existingUserSubs as any)?.userLandlord.id)
        if (!existingUserSubs) {
            throw new NotFoundError("User")
        } else if (existingUserSubs.role != RoleEnum.PROPRIETAIRE) {
            throw new ForbiddenError();
        }

        try {
            transaction = await this.repository.sequelizeInstance.transaction();
            response = await this.repository.create(data, transaction);

            //Switch case sur les types d'abonnement
            switch (checkSubType.planAbonnement as PlanAbonnementEnum) {
                case PlanAbonnementEnum.BASIC:
                    /*
                       - Verifier si l'utilisateur n'as pas déjà souscrit au paravant a un abonnement BASIC
                       - Pour ce faire on récuperer l'id de l'abonnement dont le plan d'abonnement est BASIC
                    */
                    const idSubscription = await this.abonnementRepository.getAbonnementByAttribut("planAbonnement", PlanAbonnementEnum.BASIC);
                    // On check si une ligne existe déjà concernant l'utilisateur et le type d'abonnement BASIC 
                    const userSubObject = await this.repository.checkIfUserHasAlreadySubBasic(data.utilisateurId, idSubscription.id);
                    if (
                        userSubObject
                    ) {

                        //Si l'abonnement est expiré générer la facture
                        if (userSubObject.status === StatusAbonnementEnum.EXPIRED) {
                            // Si oui générer une facture
                            const invNumber = await this.factureAbonnementRepository.getLastInvNumber();
                            const dateEcheance = new Date();
                            dateEcheance.setDate(dateEcheance.getDate() + 15);
                            const facture = await this.factureAbonnementService.createFactureAbonnement({
                                invoiceType: InvoiceType.ABONNEMENT,
                                isTva: false,
                                landlordId: (existingUserSubs as any)?.userLandlord.id,
                                notes: `FACTURES D'\ABONNEMENT GENERER LE : ${new Date()}`,
                                numeroFacture: generateIvoiceNumber(invNumber),
                                status: StatusFactures.EN_ATTENTE,
                                totalAPayer: checkSubType.prix,
                                utilisateurAbonnement: response.id,
                                dateEcheance: dateEcheance,
                            }, transaction);
                            const user = await this.utilisateurRepository.findById(userId);
                            if (!user) {
                                throw new NotFoundError("User was");
                            }
                            await this.paymentService.createPayment(userId, role, {
                                facture_type: InvoiceType.ABONNEMENT,
                                facture_id: facture.id,
                                payment_method: PaymentMethodEnum.ONLINE,
                                payment_provider: PaymentProviderEnum.FEDAPAY,
                                currency: "XOF",
                                payer_phone: user.phoneNumber,
                                payer_email: user.email,
                                payment_notes: `PAIEMENT GENERER AUTOMATIQUEMENT POUR LA FACTURE ${facture.id}-${new Date()}`,
                            })

                            await this.repository.updateUtilisateurAbonnement(response.id, { ...response, status: StatusAbonnementEnum.INACTIVE, endDate: null, startDate: null }, transaction)
                        } else {
                            throw new Error("Subscription not expired yet");
                        }
                        break;
                    } else {
                        // Si non passer le status à TRIAL et generer la facture 
                        const invoiceNumber = await this.factureAbonnementRepository.getLastInvNumber();
                        const dateEcheance = new Date();
                        dateEcheance.setDate(dateEcheance.getDate() + 15);
                        const facture = await this.factureAbonnementService.createFactureAbonnement({
                            invoiceType: InvoiceType.ABONNEMENT_TRIAL,
                            isTva: false,
                            landlordId: (existingUserSubs as any)?.userLandlord.id,
                            notes: `FACTURES D'\ABONNEMENT AU STATUT GRATUIT GENERER LE : ${new Date()}`,
                            numeroFacture: generateIvoiceNumber(invoiceNumber),
                            status: StatusFactures.EN_ATTENTE,
                            totalAPayer: checkSubType.prix,
                            utilisateurAbonnement: response.id,
                            dateEcheance: dateEcheance,
                        }, transaction);
                        const user = await this.utilisateurRepository.findById(userId);
                        if (!user) {
                            throw new NotFoundError("User was");
                        }
                        await this.paymentService.createPayment(userId, role, {
                            facture_type: InvoiceType.ABONNEMENT_TRIAL,
                            facture_id: facture.id,
                            payment_method: PaymentMethodEnum.ONLINE,
                            payment_provider: PaymentProviderEnum.FEDAPAY,
                            currency: "XOF",
                            payer_phone: user.phoneNumber,
                            payer_email: user.email,
                            payment_notes: `PAIEMENT GENERER AUTOMATIQUEMENT POUR LA FACTURE AU STATUT GRATUIT ${facture.id}-${new Date()}`,
                        })
                    }

                    const dateDebut = new Date();
                    const finDate = new Date();
                    finDate.setDate(dateDebut.getDate() + 30);



                    await this.repository.updateUtilisateurAbonnement(response.id, { ...response, status: StatusAbonnementEnum.TRIAL, startDate: dateDebut, endDate: finDate }, transaction)
                    break;

                case PlanAbonnementEnum.CUSTOM:
                case PlanAbonnementEnum.ENTREPRISE:
                case PlanAbonnementEnum.PRO:
                    //Recuperer les objets des abonnement custom , entreprise ou pro
                    const subCustom = await this.abonnementRepository.getAbonnementByAttribut("planAbonnement", PlanAbonnementEnum.CUSTOM);
                    const subPro = await this.abonnementRepository.getAbonnementByAttribut("planAbonnement", PlanAbonnementEnum.PRO);
                    const subEntreprise = await this.abonnementRepository.getAbonnementByAttribut("planAbonnement", PlanAbonnementEnum.ENTREPRISE);
                    /*
                        -Verifier si l'utilisateur a déjà un abonnement de cest types ci-dessus
                        -Si oui vérifier si cet abonnement est expiré
                        -Si non lui génerer la facture à payer
                        */
                    const existingUserWithSub = await this.repository.checkIfUserHasAlreadySubOther(data.utilisateurId, subCustom.id, subEntreprise.id, subPro.id);
                    if (existingUserWithSub.status === StatusAbonnementEnum.EXPIRED) {
                        const invNumber = await this.factureAbonnementRepository.getLastInvNumber();
                        const dateEcheance = new Date();
                        dateEcheance.setDate(dateEcheance.getDate() + 15);
                        const facture = await this.factureAbonnementService.createFactureAbonnement({
                            invoiceType: InvoiceType.ABONNEMENT,
                            isTva: false,
                            landlordId: (existingUserSubs as any)?.userLandlord.id,
                            notes: `FACTURE D'\ ABONNEMENT GENERER LE : ${new Date().getDate()}`,
                            numeroFacture: generateIvoiceNumber(invNumber),
                            status: StatusFactures.EN_ATTENTE,
                            totalAPayer: checkSubType.prix,
                            utilisateurAbonnement: response.id,
                            dateEcheance: dateEcheance,
                        }, transaction);

                        const user = await this.utilisateurRepository.findById(userId);
                        if (!user) {
                            throw new NotFoundError("User was");
                        }
                        await this.paymentService.createPayment(userId, role, {
                            facture_type: InvoiceType.ABONNEMENT,
                            facture_id: facture.id,
                            payment_method: PaymentMethodEnum.ONLINE,
                            payment_provider: PaymentProviderEnum.FEDAPAY,
                            currency: "XOF",
                            payer_phone: user.phoneNumber,
                            payer_email: user.email,
                            payment_notes: `PAIEMENT GENERER AUTOMATIQUEMENT POUR LA FACTURE ${facture.id}-${new Date()}`,
                        })

                        await this.repository.updateUtilisateurAbonnement(response.id, { ...response, status: StatusAbonnementEnum.INACTIVE, endDate: null, startDate: null }, transaction)
                    } else {
                        throw new Error("Subscription not expired yet")
                    }
            }
            await transaction.commit()

            return response;
        } catch (error) {
            if (transaction) {
                await transaction.rollback()
            }
            throw new Error(error)
        }

    }

    /**
     * Récupère une relation par son ID
     */
    async getById(id: string): Promise<Utilisateur_Abonnement> {
        try {
            const relation = await this.repository.getById(id);

            if (!relation) {
                throw new Error(`Relation Utilisateur_Abonnement avec l'ID '${id}' non trouvée`);
            }

            return relation;
        } catch (error) {
            console.error(` Erreur dans getById pour l'ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Récupère les relations avec pagination
     */
    async getAbonnementPaginated(page: number, limit: number): Promise<{
        data: Utilisateur_Abonnement[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        try {

            const validPage = Math.max(1, page);
            const validLimit = Math.min(100, Math.max(1, limit));


            return await this.repository.getAbonnementsPaginated(validPage, validLimit);
        } catch (error) {
            console.error(' Erreur dans getAbonnementPaginated:', error);
            throw new Error('Impossible de récupérer les relations paginées');
        }
    }


    async getAbonnemmentByUtilisateurPaginated(
        utilisateurId: string,
        page: number,
        limit: number
    ): Promise<{
        data: Utilisateur_Abonnement[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        try {
            return await this.repository.getAbonnemmentByUtilisateurPaginated(utilisateurId, page, limit);
        } catch (error) {
            console.error(` Erreur dans getAbonnemmentByUtilisateurPaginated pour l'ID utilisateur ${utilisateurId}:`, error);
            throw new Error('Impossible de récupérer les abonnements paginés de l\'utilisateur');
        }
    }

}