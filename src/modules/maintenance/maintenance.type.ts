import { BaseModel } from "@/common/models/base.model";
import { CategoryMaintenanceRequest } from "@/enums/CategoryMaintenanceRequest";
import { Priority } from "@/enums/Priority";
import { StatutMaintenanceRequest } from "@/enums/StatutMaintenanceRequest";

export type MaintenanceResponse = BaseModel & {
    titre: string,
    locataireId: string,
    categorie: CategoryMaintenanceRequest,
    priority: Priority,
    responsable: string,
    date: Date,
    statut: StatutMaintenanceRequest
}