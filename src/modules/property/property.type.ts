import { BaseModel } from "@/common/models/base.model";

export type PropertyResponse = BaseModel & {
    label: string;
    type: string;
    address: string;
    city: string;
    district: string;
    country: string;
    numberOfUnits: number;
    numberOfFloors: number;
    yearBuilt: string;
    description: string;
    electricityMeterNumber: string;
    waterMeterNumber: string;
    documents: string;
}