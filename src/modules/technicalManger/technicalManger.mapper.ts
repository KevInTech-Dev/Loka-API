import { BaseMapper } from "@/common/mapper/base.mapper";
import { TechnicalManager } from "@/database/models/technicalManger";
import { TechnicalManagerResponse } from "./technicalManger.type";
import { TechnicalManagerInput } from "./technicalManger.schema";

export class TechnicalMangerMapper implements BaseMapper<TechnicalManager, TechnicalManagerResponse> {
    toResponse(entity: TechnicalManager): TechnicalManagerResponse {
        return {
            id: entity.id,
            title: entity.title,
            name: entity.name,
            contact: entity.contact,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        }
    }
    toEntity(data: TechnicalManagerInput): Partial<TechnicalManager> {
        return {
            title: data.title,
            name: data.name,
            contact: data.contact
        }
    }

}