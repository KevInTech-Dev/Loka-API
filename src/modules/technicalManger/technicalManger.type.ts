import { BaseModel } from "@/common/models/base.model";
import { TechnicalManagerAttributes } from "@/database/models/technicalManger";

export type TechnicalManagerResponse = BaseModel & {
    title: string,
    name: string,
    contact: string
}

export type WhereQueryTechnicalManager = {
    [key in keyof TechnicalManagerAttributes]?: string | number | boolean;
};