import { RoleEnum } from "@/enums/RoleEnum";
import { DuplicateEntryError, NotFoundError } from "@/common/errors";

import { unitLocationResponse } from "./unitLocation.type";
import { UnitLocationRepository } from "./unitLocation.repository";
import { CreateUnitLocationInput } from "./unitLocation.schema";

export class UnitLocationService {
    private unitLocationRepository: UnitLocationRepository;

    constructor() {
        this.unitLocationRepository = new UnitLocationRepository();
    }

    async createUnitLocation(data: CreateUnitLocationInput): Promise<unitLocationResponse | null> {
        const existingunitLocation = await this.unitLocationRepository.getUnitLocationByUnitName(data.label);

        if (existingunitLocation) {
            throw new DuplicateEntryError("Email already in use");
        }

        const unitLocation = await this.unitLocationRepository.createUnitLocation({
            email: data.email,
            unitLocationname: data.unitLocationname,
            password: data.password,
            role: RoleEnum.ADMIN,
            isEmailVerified: false,
            isActive: false,
        });

        return {
            id: unitLocation.id,
            unitLocationname: unitLocation.unitLocationname,
            firstname: unitLocation.firstname,
            lastname: unitLocation.lastname,
            role: unitLocation.role,
            email: unitLocation.email,
            isActive: unitLocation.isActive,
            profilePhotoUrl: unitLocation.profilePhotoUrl,
            isEmailVerified: unitLocation.isEmailVerified,
            createdAt: unitLocation.createdAt,
            updatedAt: unitLocation.updatedAt,
        };
    }

    async getUnitLocationById(id: string): Promise<unitLocationResponse | null> {
        const unitLocation = await this.unitLocationRepository.getUnitLocationById(id);

        if (!unitLocation) {
            throw new NotFoundError("unitLocation not found");
        }

        return {
            id: unitLocation.id,
            unitLocationname: unitLocation.unitLocationname,
            firstname: unitLocation.firstname,
            lastname: unitLocation.lastname,
            role: unitLocation.role,
            email: unitLocation.email,
            isActive: unitLocation.isActive,
            profilePhotoUrl: unitLocation.profilePhotoUrl,
            isEmailVerified: unitLocation.isEmailVerified,
            createdAt: unitLocation.createdAt,
            updatedAt: unitLocation.updatedAt,
        };
    }

    async getAllUnitLocations(): Promise<unitLocationResponse[]> {
        return (await this.unitLocationRepository.getAllUnitLocations()).map((unitLocation) => {
            return {
                id: unitLocation.id,
                unitLocationname: unitLocation.unitLocationname,
                firstname: unitLocation.firstname,
                lastname: unitLocation.lastname,
                role: unitLocation.role,
                email: unitLocation.email,
                isActive: unitLocation.isActive,
                profilePhotoUrl: unitLocation.profilePhotoUrl,
                isEmailVerified: unitLocation.isEmailVerified,
                createdAt: unitLocation.createdAt,
                updatedAt: unitLocation.updatedAt,
            };
        });
    }

    async getUnitLocationPaginated(page: number, limit: number): Promise<unitLocationResponse[]> {
        return (await this.unitLocationRepository.getUnitLocationPaginated(page, limit)).map(
            (unitLocation) => {
                return {
                    id: unitLocation.id,
                    unitLocationname: unitLocation.unitLocationname,
                    firstname: unitLocation.firstname,
                    lastname: unitLocation.lastname,
                    role: unitLocation.role,
                    email: unitLocation.email,
                    isActive: unitLocation.isActive,
                    profilePhotoUrl: unitLocation.profilePhotoUrl,
                    isEmailVerified: unitLocation.isEmailVerified,
                    createdAt: unitLocation.createdAt,
                    updatedAt: unitLocation.updatedAt,
                };
            },
        );
    }

    async updateUnitLocation(
        id: string,
        data: Partial<CreateUnitLocationInput>,
    ): Promise<unitLocationResponse | null> {
        const updatedunitLocation = await this.unitLocationRepository.updateUnitLocation(id, data);
        if (!updatedUnitLocation) {
            return null;
        }
        return {
            id: updatedunitLocation.id,
            unitLocationname: updatedunitLocation.unitLocationname,
            firstname: updatedunitLocation.firstname,
            lastname: updatedunitLocation.lastname,
            role: updatedunitLocation.role,
            email: updatedunitLocation.email,
            isActive: updatedunitLocation.isActive,
            profilePhotoUrl: updatedunitLocation.profilePhotoUrl,
            isEmailVerified: updatedunitLocation.isEmailVerified,
            createdAt: updatedunitLocation.createdAt,
            updatedAt: updatedunitLocation.updatedAt,
        };
    }

    async deleteUnitLocation(id: string): Promise<boolean> {
        const deleted = await this.unitLocationRepository.deleteUnitLocation(id);
        if (!deleted) {
            throw new Error("unitLocation not found");
        }
        return true;
    }
}
