import { RoleEnum } from "@/enums/RoleEnum";
import { DuplicateEntryError, InternalServerError, NotFoundError } from "@/common/errors";

import { unitLocationResponse } from "./unitLocation.type";
import { UnitLocationRepository } from "./unitLocation.repository";
import { CreateUnitLocationInput } from "./unitLocation.schema";
import { PaginatedResult } from "@/common/paginatedResult";
import { UnitTypeRepository } from "../unitType/unitType.repository";

export class UnitLocationService {
    private unitLocationRepository: UnitLocationRepository;
    private unitTypeRespository: UnitTypeRepository;

    constructor() {
        this.unitLocationRepository = new UnitLocationRepository();
        this.unitTypeRespository = new UnitTypeRepository()
    }

    async createUnitLocation(data: CreateUnitLocationInput): Promise<unitLocationResponse> {
        const existingunitLocation = await this.unitLocationRepository.getUnitLocationByUnitName(data.unitName);

        if (existingunitLocation) {
            throw new DuplicateEntryError("An unit already in use with name", data.unitName);
        }

        const existingUnitType = await this.unitTypeRespository.getUnitTypeById(data.unitTypeId);
        if (!existingUnitType) {
            throw new NotFoundError("The specified unit type doesn't exist")
        }

        const unitLocation = await this.unitLocationRepository.createUnitLocation({
            unitTypeId: data.unitTypeId,
            unitNumber: data.unitNumber,
            unitName: data.unitName,
            floor: data.floor,
            surfaceArea: data.surfaceArea,
            isFurnished: data.isFurnished,
            electricityMeterId: data.electricityMeterId,
            waterMeterId: data.waterMeterId,
            initialElectricityReading: data.initialElectricityReading,
            initialWaterReading: data.initialWaterReading,
            monthlyRent: data.monthlyRent,
            electricityIncluded: data.electricityIncluded,
            waterIncluded: data.waterIncluded,
            unitStatus: data.unitStatus,
            description: data.description
        });

        return {
            id: unitLocation.id,
            unitTypeId: unitLocation.unitTypeId,
            unitNumber: unitLocation.unitNumber,
            unitName: unitLocation.unitName,
            floor: unitLocation.floor,
            surfaceArea: unitLocation.surfaceArea,
            isFurnished: unitLocation.isFurnished,
            electricityMeterId: unitLocation.electricityMeterId,
            waterMeterId: unitLocation.waterMeterId,
            initialElectricityReading: unitLocation.initialElectricityReading,
            initialWaterReading: unitLocation.initialWaterReading,
            monthlyRent: unitLocation.monthlyRent,
            electricityIncluded: unitLocation.electricityIncluded,
            waterIncluded: unitLocation.waterIncluded,
            amenities: unitLocation.amenities,
            unitStatus: unitLocation.unitStatus,
            description: unitLocation.description,
            createdAt: unitLocation.createdAt,
            updatedAt: unitLocation.updatedAt,

        };
    }

    async getUnitLocationById(id: string): Promise<unitLocationResponse> {
        const unitLocation = await this.unitLocationRepository.getUnitLocationById(id);

        if (!unitLocation) {
            throw new NotFoundError("unit location not found");
        }

        return {
            id: unitLocation.id,
            unitTypeId: unitLocation.unitTypeId,
            unitNumber: unitLocation.unitNumber,
            unitName: unitLocation.unitName,
            floor: unitLocation.floor,
            surfaceArea: unitLocation.surfaceArea,
            isFurnished: unitLocation.isFurnished,
            electricityMeterId: unitLocation.electricityMeterId,
            waterMeterId: unitLocation.waterMeterId,
            initialElectricityReading: unitLocation.initialElectricityReading,
            initialWaterReading: unitLocation.initialWaterReading,
            monthlyRent: unitLocation.monthlyRent,
            electricityIncluded: unitLocation.electricityIncluded,
            waterIncluded: unitLocation.waterIncluded,
            amenities: unitLocation.amenities,
            unitStatus: unitLocation.unitStatus,
            description: unitLocation.description,
            createdAt: unitLocation.createdAt,
            updatedAt: unitLocation.updatedAt,

        };
    }

    async getAllUnitLocations(page: number, limit: number): Promise<PaginatedResult<unitLocationResponse>> {
        const { rows, count } = await this.unitLocationRepository.getUnitLocationPaginated(page, limit);

        const mappedData = rows.map((unitLocation) => ({
            id: unitLocation.id,
            unitTypeId: unitLocation.unitTypeId,
            unitNumber: unitLocation.unitNumber,
            unitName: unitLocation.unitName,
            floor: unitLocation.floor,
            surfaceArea: unitLocation.surfaceArea,
            isFurnished: unitLocation.isFurnished,
            amenities: unitLocation.amenities,
            electricityMeterId: unitLocation.electricityMeterId,
            waterMeterId: unitLocation.waterMeterId,
            initialElectricityReading: unitLocation.initialElectricityReading,
            initialWaterReading: unitLocation.initialWaterReading,
            monthlyRent: unitLocation.monthlyRent,
            electricityIncluded: unitLocation.electricityIncluded,
            waterIncluded: unitLocation.waterIncluded,
            unitStatus: unitLocation.unitStatus,
            description: unitLocation.description,
            createdAt: unitLocation.createdAt,
            updatedAt: unitLocation.updatedAt,

        }));

        return {
            data: mappedData,
            total: count
        }
    }

    async updateUnitLocation(
        id: string,
        data: Partial<CreateUnitLocationInput>,
    ): Promise<unitLocationResponse> {
        const isIdExisting = await this.unitLocationRepository.getUnitLocationById(id);
        if (!isIdExisting) {
            throw new NotFoundError("Id not found");
        }
        const unitLocation = await this.unitLocationRepository.updateUnitLocation(id, data);
        if (!unitLocation) {
            throw new InternalServerError("Error while updating the unit")
        }
        return {
            id: unitLocation.id,
            unitTypeId: unitLocation.unitTypeId,
            unitNumber: unitLocation.unitNumber,
            unitName: unitLocation.unitName,
            floor: unitLocation.floor,
            surfaceArea: unitLocation.surfaceArea,
            isFurnished: unitLocation.isFurnished,
            electricityMeterId: unitLocation.electricityMeterId,
            waterMeterId: unitLocation.waterMeterId,
            initialElectricityReading: unitLocation.initialElectricityReading,
            initialWaterReading: unitLocation.initialWaterReading,
            monthlyRent: unitLocation.monthlyRent,
            electricityIncluded: unitLocation.electricityIncluded,
            waterIncluded: unitLocation.waterIncluded,
            amenities: unitLocation.amenities,
            unitStatus: unitLocation.unitStatus,
            description: unitLocation.description,
            createdAt: unitLocation.createdAt,
            updatedAt: unitLocation.updatedAt
        };
    }

    async deleteUnitLocation(id: string): Promise<boolean> {
        const deleted = await this.unitLocationRepository.getUnitLocationById(id);
        if (!deleted) {
            throw new Error("unitLocation not found");
        }
        deleted.destroy();
        return true;
    }
}
