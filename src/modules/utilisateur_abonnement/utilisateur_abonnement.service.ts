import { Utilisateur_AbonnementRepository } from "./utilisateur_abonnement.repository";
import { Utilisateur_Abonnement } from "@database/models/Utilisateur_Abonnement";
import { UtilisateurAbonnementAttributes } from "@database/models/Utilisateur_Abonnement";
import { AbonnementRepository } from "../abonnements/abonnement.repository";
import { UserRepository } from "../users/user.repository";
import { NotFoundError } from "@/common/errors";
import { PlanAbonnementEnum } from "@/enums/PlanAbonnementEnum";
import { StatusAbonnementEnum } from "@/enums/StatusAbonnement";
import { FactureAbonnementService } from "../Facture_Abonnement/facture.service";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { FactureAbonnementRepository } from "../Facture_Abonnement/facture.repository";
import { generateIvoiceNumber } from "@/common/generateInvoiceNumber";
import { StatusFactures } from "@/enums/StatusFacturesEnum";
import { Transaction } from "sequelize";
import { error } from "node:console";

export class Utilisateur_AbonnementService {
    private repository: Utilisateur_AbonnementRepository;
    private abonnementRepository: AbonnementRepository;
    private utilisateurRepository: UserRepository;
    private factureAbonnementService: FactureAbonnementService;
    private factureAbonnementRepository: FactureAbonnementRepository;

    constructor() {
        this.repository = new Utilisateur_AbonnementRepository();
        this.abonnementRepository = new AbonnementRepository();
        this.utilisateurRepository = new UserRepository();
        this.factureAbonnementService = new FactureAbonnementService();
        this.factureAbonnementRepository = new FactureAbonnementRepository();
    }

    /**
     * Crée une nouvelle relation utilisateur-abonnement
    */
    async create(data: UtilisateurAbonnementAttributes): Promise<Utilisateur_Abonnement> {
        let transaction: Transaction;
        let response;
        //Verifier le type d'abonnement
        const checkSubType = await this.abonnementRepository.findById(data.abonnementId);
        if (!checkSubType) {
            throw new NotFoundError("This subscription");
        }
        //Verifier si l'utilisateur existe
        const existingUserSubs = await this.utilisateurRepository.findById(data.utilisateurId);
        if (!existingUserSubs) {
            throw new NotFoundError("User")
        }
        //Verifier si l'abonnement existe
        const existingSub = await this.abonnementRepository.findById(data.abonnementId);
        if (!existingSub) {
            throw new NotFoundError("Subscription")
        }

        try {

            transaction = await this.repository.sequelizeInstance.transaction()
            response = await this.repository.create(data, transaction)

            //Switch case sur les types d'abonnement
            switch (checkSubType.planAbonnement as PlanAbonnementEnum) {
                case PlanAbonnementEnum.BASIC:
                    /*
                       - Verifier si l'utilisateur n'as pas déjà souscrit au paravant a un abonnement BASIC
                       - Pour ce faire on récuperer l'id de l'abonnement dont le plan d'abonnement est BASIC
                    */
                    const idSubscription = await this.abonnementRepository.getAbonnementByAttribut("planAbonnement", PlanAbonnementEnum.BASIC);
                    // On check si une ligne existe déjà concernant l'utilisateur et le type d'abonnement BASIC 
                    if (
                        await this.repository.checkIfUserHasAlreadySubBasic(data.utilisateurId, idSubscription.id)
                    ) {

                        const transaction = await this.repository.sequelizeInstance.transaction();
                        // Si oui générer une facture
                        const invNumber = await this.factureAbonnementRepository.getLastInvNumber();
                        this.factureAbonnementService.createFactureAbonnement({
                            invoiceType: InvoiceType.ABONNEMENT,
                            isTva: false,
                            landlordId: data.utilisateurId,
                            notes: `FACTURES D'\ABONNEMENT GENERER LE : ${new Date().getDate()}`,
                            numeroFacture: generateIvoiceNumber(invNumber),
                            status: StatusFactures.EN_ATTENTE,
                            totalAPayer: checkSubType.prix,
                            utilisateurAbonnement: response.id,
                            dateEcheance: new Date(new Date().getDate() + 15),
                        }, transaction)

                        await this.repository.updateUtilisateurAbonnement(data.id, { ...data, status: StatusAbonnementEnum.INACTIVE }, transaction);
                    }

                    // Si non passer le status à TRIAL
                    const dateDebut = data.startDate = new Date();
                    const finDate = new Date(data.endDate.setDate(dateDebut.getDate() + 30));
                    await this.repository.updateUtilisateurAbonnement(data.id, { ...data, status: StatusAbonnementEnum.TRIAL, endDate: finDate, startDate: dateDebut }, transaction)
                    break;

                case PlanAbonnementEnum.CUSTOM || PlanAbonnementEnum.ENTREPRISE || PlanAbonnementEnum.PRO:
                    const invNumber = await this.factureAbonnementRepository.getLastInvNumber();
                    this.factureAbonnementService.createFactureAbonnement({
                        invoiceType: InvoiceType.ABONNEMENT,
                        isTva: false,
                        landlordId: data.utilisateurId,
                        notes: `FACTURE D'\ ABONNEMENT GENERER LE : ${new Date().getDate()}`,
                        numeroFacture: generateIvoiceNumber(invNumber),
                        status: StatusFactures.EN_ATTENTE,
                        totalAPayer: checkSubType.prix,
                        utilisateurAbonnement: response.id,
                        dateEcheance: new Date(new Date().getDate() + 15),
                    }, transaction);
                    await this.repository.updateUtilisateurAbonnement(data.id, { ...data, status: StatusAbonnementEnum.INACTIVE }, transaction)
            }
            transaction.commit()
        } catch (error) {
            if (transaction) {
                transaction.rollback()
            }
            console.log("error", error)
        }
        return response;
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