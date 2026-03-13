import { NotFoundError } from "@/common/errors";
import { TechnicalMangerRepository } from "../technicalManger/technicalManger.repository";
import { CreateMaintenanceInput } from "./maintenance.schema";

import { MaintenanceMapper } from "./maintenance.mapper";
import { MaintenanceRepository } from "./maintenance.repository";
import { MaintenanceResponse } from "./maintenance.type";


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
        //Verifier si le technicalManger existe
        const existingTechnical = await this.technicalManagerRepository.findById(data.responsable);
        if (!existingTechnical) {
            throw new NotFoundError("Technical Manger")
        }

        const dataSave = await this.maintenanceRespository.create(this.maintenancerMapper.toEntity(data));
        return dataSave;
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