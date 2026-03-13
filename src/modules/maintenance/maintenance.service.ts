import { DuplicateEntryError, NotFoundError } from "@/common/errors";
import { TechnicalMangerRepository } from "../technicalManger/technicalManger.repository";
import { AddTechnicalManager, CreateMaintenanceInput } from "./maintenance.schema";

import { MaintenanceMapper } from "./maintenance.mapper";
import { MaintenanceRepository } from "./maintenance.repository";
import { MaintenanceResponse } from "./maintenance.type";
import { StatutMaintenanceRequest } from "@/enums/StatutMaintenanceRequest";


export class MaintenanceService {
    private technicalManagerRepository: TechnicalMangerRepository;
    private maintenancerMapper: MaintenanceMapper;
    private maintenanceRespository: MaintenanceRepository;
    constructor() {
        this.technicalManagerRepository = new TechnicalMangerRepository();
        this.maintenancerMapper = new MaintenanceMapper();
        this.maintenanceRespository = new MaintenanceRepository()
    }

    async createMaintenance(data: CreateMaintenanceInput): Promise<MaintenanceResponse> {
        //Verifier si le locataire a deja effectuer une requete a un date precise
        const checkRequest = await this.maintenanceRespository.checkRequestOfUser(data.locataireId, data.categorie);

        if (checkRequest) {
            throw new DuplicateEntryError("You did a request already");
        }

        return await this.maintenanceRespository.createMaintenance(this.maintenancerMapper.toEntity(data));
    }

    async updateMaintenance(id: string, data: CreateMaintenanceInput): Promise<MaintenanceResponse> {
        //verifier l'existance de l'id
        const verifyId = await this.maintenanceRespository.findById(id);
        if (!verifyId) {
            throw new NotFoundError("Maintenance");
        }

        const updatedData = await this.maintenanceRespository.update(id, data);
        if (!updatedData) {
            throw new Error("Error when updating");
        }

        return await this.maintenancerMapper.toResponse(updatedData);
    }

    async addTechnicalManager(id: string, data: AddTechnicalManager): Promise<MaintenanceResponse> {
        //verifier l'existance de l'id
        const verifyId = await this.maintenanceRespository.findById(id);
        if (!verifyId) {
            throw new NotFoundError("Maintenance");
        }

        //Verifier l'existance du technical manager
        const verifyTechnicalManager = await this.technicalManagerRepository.findById(data.responsable);
        if (!verifyTechnicalManager) {
            throw new NotFoundError("This technical manager");
        }

        const updatedData = await this.maintenanceRespository.update(id, { ...data, responsable: data.responsable, statut: StatutMaintenanceRequest.ACCUSED });
        if (!updatedData) {
            throw new Error("Error when updating");
        }

        return await this.maintenancerMapper.toResponse(updatedData);
    }

    async getMaintenanceById(id: string): Promise<MaintenanceResponse> {
        //verifier l'existance de l'id
        const verifyId = await this.maintenanceRespository.findById(id);
        if (!verifyId) {
            throw new NotFoundError("Maintenance");
        }

        const findData = await this.maintenanceRespository.findById(id);
        return await this.maintenancerMapper.toResponse(findData);
    }

    async getMaintenance(page: number, limit: number) {
        const { count, rows } = await this.maintenanceRespository.getMaintenancePaginated(page, limit);
        const mappedData = rows.map((object) => ({
            id: object.id,
            titre: object.titre,
            locataireId: object.locataireId,
            categorie: object.categorie,
            priority: object.priority,
            responsable: object.responsable,
            date: object.date,
            statut: object.statut
        }));
        return {
            data: mappedData,
            total: count
        }
    }

    async deleteMaintenace(id: string) {
        //verifier l'existance de l'id
        const verifyId = await this.maintenanceRespository.findById(id);
        if (!verifyId) {
            throw new NotFoundError("Maintenance");
        }

        if (await this.maintenanceRespository.softDelete(id)) {
            return true;
        } else {
            throw new Error("Erroe when deleting")
        }
    }
}