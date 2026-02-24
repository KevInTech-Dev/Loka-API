import { Utilisateur_AbonnementRepository } from "./utilisateur_abonnement.repository";

export class Utilisateur_AbonnementService {
    private repository: Utilisateur_AbonnementRepository;

    constructor() {
        this.repository = new Utilisateur_AbonnementRepository();
    }

    async create(data: any) {
        return await this.repository.create(data);
    }

    async getById(id: string) {
        const relation = await this.repository.getById(id);
        if (!relation) throw new Error("Relation Utilisateur_Abonnement non trouvée");
        return relation;
    }

    async getAll() {
        return await this.repository.getAll();
    }
/*
    async update(id: string, data: any) {
        return await this.repository.update(id, data);
    }

    async delete(id: string) {
        const success = await this.repository.delete(id);
        if (!success) throw new Error("Impossible de supprimer : relation introuvable");
        return success;
    }
*/
}