import { BaseTypes } from "@/common/models/base.model";
import { PlanAbonnementEnum } from "@/enums/PlanAbonnementEnum";


export type AbonnementResponse = BaseTypes & {
  planAbonnement: PlanAbonnementEnum;
  label: string;
  prix: number;
  duree: number; 
  detais: string;
  other: string;
  
};
