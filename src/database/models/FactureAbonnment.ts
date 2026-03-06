import { BaseModel } from "@/common/models/base.model";

export interface FactureAbonnementAttributes extends BaseModel {
  
    landlordId: string;
    utilisateurAbonnement: string;
    totalAPayer: number;
}