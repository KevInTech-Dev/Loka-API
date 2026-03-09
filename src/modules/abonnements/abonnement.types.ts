import { BaseTypes } from "@/common/models/base.model";
import { AbonnementAttributes } from "@/database/models/Abonnements";
import { PlanAbonnementEnum } from "@/enums/PlanAbonnementEnum";


export type AbonnementResponse = BaseTypes & {
  planAbonnement: PlanAbonnementEnum;
  nombreMaxProprietes: number;
  nombreMaxUnitLocation: number;
  label: string;
  prix: number;
  details: string;
  other: JSON;

};

export type WhereQueryAbonnements = {
  [key in keyof AbonnementAttributes]?: string | number | boolean;
};