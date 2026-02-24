import { RoleEnum } from "@/enums/RoleEnum";
import { DuplicateEntryError, NotFoundError } from "@/common/errors";
import { unitTypeResponse } from "./unitType.type";
import { UnitTypeRepository } from "./unitType.repository";
import { CreateUnitTypeInput } from "./unitType.schema";

export class UnitTypeService {
    private unitTypeRepository: UnitTypeRepository;

    constructor() {
        this.unitTypeRepository = new UnitTypeRepository();
    }

    async createUnitType(data: CreateUnitTypeInput): Promise<unitTypeResponse | null> {
        const existingunitType = await this.unitTypeRepository.getUnitTypeByLabel(data.label);

        if (existingunitType) {
            throw new DuplicateEntryError("Email already in use");
        }

        const unitType = await this.unitTypeRepository.createUnitType({
            email: data.email,
            unitTypename: data.unitTypename,
            password: data.password,
            role: RoleEnum.ADMIN,
            isEmailVerified: false,
            isActive: false,
        });

        return {
            id: unitType.id,
            unitTypename: unitType.unitTypename,
            firstname: unitType.firstname,
            lastname: unitType.lastname,
            role: unitType.role,
            email: unitType.email,
            isActive: unitType.isActive,
            profilePhotoUrl: unitType.profilePhotoUrl,
            isEmailVerified: unitType.isEmailVerified,
            createdAt: unitType.createdAt,
            updatedAt: unitType.updatedAt,
        };
    }

    async getUnitTypeById(id: string): Promise<unitTypeResponse | null> {
        const unitType = await this.unitTypeRepository.getUnitTypeById(id);

        if (!unitType) {
            throw new NotFoundError("unitType not found");
        }

        return {
            id: unitType.id,
            unitTypename: unitType.unitTypename,
            firstname: unitType.firstname,
            lastname: unitType.lastname,
            role: unitType.role,
            email: unitType.email,
            isActive: unitType.isActive,
            profilePhotoUrl: unitType.profilePhotoUrl,
            isEmailVerified: unitType.isEmailVerified,
            createdAt: unitType.createdAt,
            updatedAt: unitType.updatedAt,
        };
    }

    async getAllUnitTypes(): Promise<unitTypeResponse[]> {
        return (await this.unitTypeRepository.getAllUnitTypes()).map((unitType) => {
            return {
                id: unitType.id,
                unitTypename: unitType.unitTypename,
                firstname: unitType.firstname,
                lastname: unitType.lastname,
                role: unitType.role,
                email: unitType.email,
                isActive: unitType.isActive,
                profilePhotoUrl: unitType.profilePhotoUrl,
                isEmailVerified: unitType.isEmailVerified,
                createdAt: unitType.createdAt,
                updatedAt: unitType.updatedAt,
            };
        });
    }

    async getUnitTypePaginated(page: number, limit: number): Promise<unitTypeResponse[]> {
        return (await this.unitTypeRepository.getUnitTypePaginated(page, limit)).map(
            (unitType) => {
                return {
                    id: unitType.id,
                    unitTypename: unitType.unitTypename,
                    firstname: unitType.firstname,
                    lastname: unitType.lastname,
                    role: unitType.role,
                    email: unitType.email,
                    isActive: unitType.isActive,
                    profilePhotoUrl: unitType.profilePhotoUrl,
                    isEmailVerified: unitType.isEmailVerified,
                    createdAt: unitType.createdAt,
                    updatedAt: unitType.updatedAt,
                };
            },
        );
    }

    async updateUnitType(
        id: string,
        data: Partial<CreateUnitTypeInput>,
    ): Promise<unitTypeResponse | null> {
        const updatedunitType = await this.unitTypeRepository.updateUnitType(id, data);
        if (!updatedunitType) {
            return null;
        }
        return {
            id: updatedunitType.id,
            unitTypename: updatedunitType.unitTypename,
            firstname: updatedunitType.firstname,
            lastname: updatedunitType.lastname,
            role: updatedunitType.role,
            email: updatedunitType.email,
            isActive: updatedunitType.isActive,
            profilePhotoUrl: updatedunitType.profilePhotoUrl,
            isEmailVerified: updatedunitType.isEmailVerified,
            createdAt: updatedunitType.createdAt,
            updatedAt: updatedunitType.updatedAt,
        };
    }

    async deleteUnitType(id: string): Promise<boolean> {
        const deleted = await this.unitTypeRepository.deleteUnitType(id);
        if (!deleted) {
            throw new Error("unitType not found");
        }
        return true;
    }
}
