import { BaseModel } from "@/common/models/base.model";

export interface FactureEauAttributes extends BaseModel {
    
    unitLocation: string;
    idTenant: string;
    idReleveCompteur: string;
    totalAPayer: number;
}