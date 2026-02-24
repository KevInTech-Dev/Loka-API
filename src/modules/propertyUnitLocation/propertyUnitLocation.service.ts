import { RoleEnum } from "@/enums/RoleEnum";
import { DuplicateEntryError, NotFoundError } from "@/common/errors";
import { propertyUnitLocationResponse } from "./propertyUnitLocation.type";
import { CreatepropertyUnitLocationInput } from "./propertyUnitLocation.schema";
import { PropertyUnitLocationRepository } from "./propertyUnitLocation.repository";

export class PropertyUnitLocationService {
    private propertyUnitLocationRepository: PropertyUnitLocationRepository;

    constructor() {
        this.propertyUnitLocationRepository = new PropertyUnitLocationRepository();
    }

    async createpropertyUnitLocation(data: CreatepropertyUnitLocationInput): Promise<propertyUnitLocationResponse | null> {
        const existingpropertyUnitLocation = await this.propertyUnitLocationRepository.getPropertyUnitLocationById(data.label);

        if (existingpropertyUnitLocation) {
            throw new DuplicateEntryError("Email already in use");
        }

        const propertyUnitLocation = await this.propertyUnitLocationRepository.createPropertyUnitLocation({
            email: data.email,
            propertyUnitLocationname: data.propertyUnitLocationname,
            password: data.password,
            role: RoleEnum.ADMIN,
            isEmailVerified: false,
            isActive: false,
        });

        return {
            id: propertyUnitLocation.id,
            propertyUnitLocationname: propertyUnitLocation.propertyUnitLocationname,
            firstname: propertyUnitLocation.firstname,
            lastname: propertyUnitLocation.lastname,
            role: propertyUnitLocation.role,
            email: propertyUnitLocation.email,
            isActive: propertyUnitLocation.isActive,
            profilePhotoUrl: propertyUnitLocation.profilePhotoUrl,
            isEmailVerified: propertyUnitLocation.isEmailVerified,
            createdAt: propertyUnitLocation.createdAt,
            updatedAt: propertyUnitLocation.updatedAt,
        };
    }

    async getpropertyUnitLocationById(id: string): Promise<propertyUnitLocationResponse | null> {
        const propertyUnitLocation = await this.propertyUnitLocationRepository.getpropertyUnitLocationById(id);

        if (!propertyUnitLocation) {
            throw new NotFoundError("propertyUnitLocation not found");
        }

        return {
            id: propertyUnitLocation.id,
            propertyUnitLocationname: propertyUnitLocation.propertyUnitLocationname,
            firstname: propertyUnitLocation.firstname,
            lastname: propertyUnitLocation.lastname,
            role: propertyUnitLocation.role,
            email: propertyUnitLocation.email,
            isActive: propertyUnitLocation.isActive,
            profilePhotoUrl: propertyUnitLocation.profilePhotoUrl,
            isEmailVerified: propertyUnitLocation.isEmailVerified,
            createdAt: propertyUnitLocation.createdAt,
            updatedAt: propertyUnitLocation.updatedAt,
        };
    }

    async getAllpropertyUnitLocations(): Promise<propertyUnitLocationResponse[]> {
        return (await this.propertyUnitLocationRepository.getAllPropertyUnitLocations()).map((propertyUnitLocation) => {
            return {
                id: propertyUnitLocation.id,
                propertyUnitLocationname: propertyUnitLocation.propertyUnitLocationname,
                firstname: propertyUnitLocation.firstname,
                lastname: propertyUnitLocation.lastname,
                role: propertyUnitLocation.role,
                email: propertyUnitLocation.email,
                isActive: propertyUnitLocation.isActive,
                profilePhotoUrl: propertyUnitLocation.profilePhotoUrl,
                isEmailVerified: propertyUnitLocation.isEmailVerified,
                createdAt: propertyUnitLocation.createdAt,
                updatedAt: propertyUnitLocation.updatedAt,
            };
        });
    }

    async getpropertyUnitLocationPaginated(page: number, limit: number): Promise<propertyUnitLocationResponse[]> {
        return (await this.propertyUnitLocationRepository.getPropertyUnitLocationPaginated(page, limit)).map(
            (propertyUnitLocation) => {
                return {
                    id: propertyUnitLocation.id,
                    propertyUnitLocationname: propertyUnitLocation.propertyUnitLocationname,
                    firstname: propertyUnitLocation.firstname,
                    lastname: propertyUnitLocation.lastname,
                    role: propertyUnitLocation.role,
                    email: propertyUnitLocation.email,
                    isActive: propertyUnitLocation.isActive,
                    profilePhotoUrl: propertyUnitLocation.profilePhotoUrl,
                    isEmailVerified: propertyUnitLocation.isEmailVerified,
                    createdAt: propertyUnitLocation.createdAt,
                    updatedAt: propertyUnitLocation.updatedAt,
                };
            },
        );
    }

    async updatepropertyUnitLocation(
        id: string,
        data: Partial<CreatepropertyUnitLocationInput>,
    ): Promise<propertyUnitLocationResponse | null> {
        const updatedpropertyUnitLocation = await this.propertyUnitLocationRepository.updatePropertyUnitLocation(id, data);
        if (!updatedpropertyUnitLocation) {
            return null;
        }
        return {
            id: updatedpropertyUnitLocation.id,
            propertyUnitLocationname: updatedpropertyUnitLocation.propertyUnitLocationname,
            firstname: updatedpropertyUnitLocation.firstname,
            lastname: updatedpropertyUnitLocation.lastname,
            role: updatedpropertyUnitLocation.role,
            email: updatedpropertyUnitLocation.email,
            isActive: updatedpropertyUnitLocation.isActive,
            profilePhotoUrl: updatedpropertyUnitLocation.profilePhotoUrl,
            isEmailVerified: updatedpropertyUnitLocation.isEmailVerified,
            createdAt: updatedpropertyUnitLocation.createdAt,
            updatedAt: updatedpropertyUnitLocation.updatedAt,
        };
    }

    async deletepropertyUnitLocation(id: string): Promise<boolean> {
        const deleted = await this.propertyUnitLocationRepository.deletePropertyUnitLocation(id);
        if (!deleted) {
            throw new Error("propertyUnitLocation not found");
        }
        return true;
    }
}
