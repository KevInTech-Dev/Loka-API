import { CreateAbonnementInput, UpdateAbonnementInput } from "@modules/abonnements/abonnement.schema";
import { AbonnementRepository } from "@modules/abonnements/abonnement.repository";
import { PlanAbonnementEnum } from "@/enums/PlanAbonnementEnum";
import { DuplicateEntryError, NotFoundError } from "@/common/errors";
import { AbonnementResponse } from "./abonnement.types";
import { object } from "zod";
import { AbonnementAttributes } from "@/database/models/Abonnements";
import { PaginatedResult } from "@/common/paginatedResult";
//import { DuplicateEntryError, NotFoundError } from "@/common/errors";

export class AbonnementService {

    private abonnementRepository: AbonnementRepository;

    constructor() {
        this.abonnementRepository = new AbonnementRepository();
    }


    async createAbonnement(data: CreateAbonnementInput) {
        // Vérifier si un abonnement avec ce label existe déjà
        const existingAbonnement = await this.abonnementRepository.getAbonnementByAttribut("label", data.label);
        if (existingAbonnement) {
            throw new DuplicateEntryError("Subscription already exist");
        }


        // Créer l'abonnement
        const abonnement = await this.abonnementRepository.create({
            planAbonnement: data.planAbonnement as PlanAbonnementEnum,
            nombreMaxProprietes: data.nombreMaxPropriete as number,
            nombreMaxUnitLocation: data.nombreMaxUnitLocation as number,
            label: data.label || null,
            prix: data.prix,
            detail: data.detail,
            other: data.other as any,
        });

        return {
            id: abonnement.id,
            planAbonnement: abonnement.planAbonnement,
            nombreMaxPropriete: abonnement.nombreMaxProprietes,
            nombreMaxUnitLocation: abonnement.nombreMaxUnitLocation,
            label: abonnement.label,
            prix: abonnement.prix,
            detail: abonnement.detail,
            other: abonnement.other,
            createdAt: abonnement.createdAt,
            updatedAt: abonnement.updatedAt,
        };
    }


    async getAbonnementById(id: string) {
        const abonnement = await this.abonnementRepository.findById(id);
        if (!abonnement) {
            throw new NotFoundError("Abonnement was");
        }
        return abonnement;
    }


    async getAbonnementPaginated(page: number, limit: number): Promise<PaginatedResult<AbonnementResponse>> {
        const { rows, count } = await this.abonnementRepository.getAbonnementPaginated(page, limit);
        const mappedData = rows.map(
            (objects) => {
                return {
                    id: objects.id,
                    planAbonnement: objects.planAbonnement,
                    nombreMaxProprietes: objects.nombreMaxProprietes,
                    nombreMaxUnitLocation: objects.nombreMaxUnitLocation,
                    label: objects.label,
                    prix: objects.prix,
                    details: objects.detail,
                    createdAt: objects.createdAt,
                    updatedAt: objects.updatedAt,
                    other: objects.other
                }
            });
        return {
            data: mappedData,
            total: count
        }
    }

    updateAbonnement = async (id: string, data: Partial<AbonnementAttributes>) => {
        const existingAbonnement = await this.abonnementRepository.findById(id);
        if (!existingAbonnement) {
            throw new NotFoundError("Subscription was");
        }
        const dataModify = await this.abonnementRepository.update(id, data);
        return {
            id: dataModify.id,
            PlanAbonnementEnum: dataModify.planAbonnement,
            nombreMaxProprietes: dataModify.nombreMaxProprietes,
            nombreMaxUnitLocation: dataModify.nombreMaxUnitLocation,
            label: dataModify.label,
            prix: dataModify.prix,
            detail: dataModify.detail,
            other: dataModify.other,
            createdAt: dataModify.createdAt,
            updatedAt: dataModify.updatedAt
        }
    }




    async deleteAbonnement(id: string): Promise<boolean> {
        const existingId = await this.abonnementRepository.findById(id);
        if (!existingId) {
            throw new NotFoundError("Abonnement was");
        }
        const deleted = await this.abonnementRepository.softDelete(id);
        if (!deleted) {
            throw new Error('Erreur l\'ors de la suppresion');
        }
        return true;
    }
}
