import { BaseModel } from "@/common/models/base.model";

export interface FactureElectriciteAttributes extends BaseModel {
    
    unitLocation: string;
    idTenant: string;
    idReleveCompteur: string;
    totalAPayer: number;
}