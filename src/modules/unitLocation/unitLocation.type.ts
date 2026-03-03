import { BaseTypes } from "@/common/models/base.model";
import { UnitStatusEnum } from "@/enums/UnitStatusEnum";
import { Json } from "sequelize/lib/utils";

export type unitLocationResponse = BaseTypes & {
    unitTypeId: string;
    unitNumber: string;
    unitName: string;
    floor: number;
    surfaceArea: number;
    isFurnished: Boolean,
    amenities: Json,
    electricityMeterId: string;
    waterMeterId: string;
    initialElectricityReading: number;
    initialWaterReading: number;
    monthlyRent: number;
    electricityIncluded: Boolean;
    waterIncluded: Boolean;
    unitStatus: UnitStatusEnum;
    description: string;
}