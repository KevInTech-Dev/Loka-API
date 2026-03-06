import { BaseModel } from "@/common/models/base.model";
import { Facture } from "./Facture";

export interface FactureMaintenanceAttributes extends BaseModel {
    unitLocation: string;
    idTenant: string;
    maintenanceId: string;
}