import { RoleEnum } from "@/enums/RoleEnum";
import { DuplicateEntryError, InternalServerError, NotFoundError } from "@/common/errors";
import { unitTypeResponse } from "./unitType.type";
import { UnitTypeRepository } from "./unitType.repository";
import { CreateUnitTypeInput } from "./unitType.schema";
import { PaginatedResult } from "@/common/paginatedResult";
import { isAborted } from "zod/v3";

export class UnitTypeService {
    private unitTypeRepository: UnitTypeRepository;

    constructor() {
        this.unitTypeRepository = new UnitTypeRepository();
    }

    async createUnitType(data: CreateUnitTypeInput): Promise<unitTypeResponse> {
        const existingUnitType = await this.unitTypeRepository.getUnitTypeByLabel(data.label);
        if (existingUnitType) {
            throw new DuplicateEntryError("Unit type already exist");
        }

        const unitType = await this.unitTypeRepository.createUnitType({
            code: data.code,
            label: data.label,
            isActive: data.isActive
        });

        return {
            id: unitType.id,
            code: unitType.code,
            label: unitType.label,
            isActive: unitType.isActive,
            createdAt: unitType.createdAt,
            updatedAt: unitType.updatedAt
        };
    }

    async getUnitTypeById(id: string): Promise<unitTypeResponse> {
        const unitType = await this.unitTypeRepository.getUnitTypeById(id);

        if (!unitType) {
            throw new NotFoundError("UnitType not found");
        }

        return {
            id: unitType.id,
            code: unitType.code,
            label: unitType.label,
            isActive: unitType.isActive,
            createdAt: unitType.createdAt,
            updatedAt: unitType.updatedAt
        };
    }

    async getAllUnitTypes(page: number, limit: number): Promise<PaginatedResult<unitTypeResponse>> {
        const { rows, count } = await this.unitTypeRepository.getUnitTypePaginated(page, limit);
        const mappedData = rows.map((unitType) => ({
            id: unitType.id,
            code: unitType.code,
            label: unitType.label,
            isActive: unitType.isActive,
            createdAt: unitType.createdAt,
            updatedAt: unitType.updatedAt
        }));
        return {
            data: mappedData,
            total: count
        }
    }

    async updateUnitType(
        id: string,
        data: Partial<CreateUnitTypeInput>,
    ): Promise<unitTypeResponse> {
        const existingId = await this.unitTypeRepository.getUnitTypeById(id);
        if (!existingId) {
            throw new NotFoundError("Id not found")
        }

        const updatedunitType = await this.unitTypeRepository.updateUnitType(id, data);
        if (!updatedunitType) {
            throw new InternalServerError("Error while updating the unit type")
        }
        return {
            id: updatedunitType.id,
            code: updatedunitType.code,
            label: updatedunitType.label,
            isActive: updatedunitType.isActive,
            createdAt: updatedunitType.createdAt,
            updatedAt: updatedunitType.updatedAt
        };
    }

    // async deleteUnitType(id: string): Promise<boolean> {
    //     const deleted = await this.unitTypeRepository.deleteUnitType(id);
    //     if (!deleted) {
    //         throw new Error("unitType not found");
    //     }
    //     return true;
    // }
}
