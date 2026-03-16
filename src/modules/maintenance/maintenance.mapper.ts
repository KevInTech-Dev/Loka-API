import { BaseMapper } from "@/common/mapper/base.mapper";
import { Maintenance } from "@/database/models/maintenance";
import { MaintenanceResponse } from "./maintenance.type";
import { CreateMaintenanceInput } from "./maintenance.schema";
import { Priority } from "@/enums/Priority";
import { CategoryMaintenanceRequest } from "@/enums/CategoryMaintenanceRequest";
import { StatutMaintenanceRequest } from "@/enums/StatutMaintenanceRequest";

export class MaintenanceMapper implements BaseMapper<Maintenance, MaintenanceResponse> {
    toResponse(entity: Maintenance): MaintenanceResponse {
        return {
            id: entity.id,
            titre: entity.titre,
            locataireId: entity.locataireId,
            categorie: entity.categorie,
            priority: entity.priority,
            responsable: entity.responsable,
            date: entity.date,
            statut: entity.statut,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        }
    }
    toEntity(data: CreateMaintenanceInput): Partial<MaintenanceResponse> {
        return {
            titre: data.titre,
            locataireId: data.locataireId,
            categorie: data.categorie,
            priority: null,
            responsable: null,
            date: new Date(),
            statut: StatutMaintenanceRequest.SUBMITTED
        }
    }

} 