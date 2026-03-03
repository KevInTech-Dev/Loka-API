import { NotFoundError } from "@/common/errors";
import { PropertyUnitLocationResponse } from "./propertyUnitLocation.type";
import { CreatepropertyUnitLocationInput } from "./propertyUnitLocation.schema";
import { PropertyUnitLocationRepository } from "./propertyUnitLocation.repository";
import { PropertyRepository } from "../property/property.repository";
import { UnitLocationRepository } from "../unitLocation/unitLocation.repository";
import { PaginatedResult } from "@/common/paginatedResult";

export class PropertyUnitLocationService {
    //Injection du propertyUnitLocationRepository
    private propertyUnitLocationRepository: PropertyUnitLocationRepository;
    private propertyRepository: PropertyRepository;
    private unitLocationRepository: UnitLocationRepository;

    //constructeur sans parametre de la classe propertyUnitLocation
    constructor() {
        this.propertyUnitLocationRepository = new PropertyUnitLocationRepository();
        this.propertyRepository = new PropertyRepository();
        this.unitLocationRepository = new UnitLocationRepository();
    }

    //méthode pour creer l'association entre unitLocation et propriet
    async createPropertyUnitLocation(data: CreatepropertyUnitLocationInput): Promise<PropertyUnitLocationResponse | null> {
        //verifier si la propriete existe
        const existingProperty = await this.propertyRepository.getPropertyById(data.propertyId);
        if (!existingProperty) {
            throw new NotFoundError("The property doesn/'t exist");
        }
        //verifier si l'unite de location existe
        const existingUnitLocation = await this.unitLocationRepository.getUnitLocationById(data.unitLocationId);
        if (!existingUnitLocation) {
            throw new NotFoundError("The unit location doesn/'t exist")
        }

        const propertyUnitLocation = (await this.propertyUnitLocationRepository.createPropertyUnitLocation({
            unitLocationId: data.unitLocationId,
            propertyId: data.propertyId
        }));

        return {
            id: propertyUnitLocation.id,
            unitLocationId: propertyUnitLocation.unitLocationId,
            propertyId: propertyUnitLocation.propertyId,
            createdAt: propertyUnitLocation.createdAt,
            updatedAt: propertyUnitLocation.updatedAt,

        }
    };

    //recuperer par id
    async getpropertyUnitLocationById(id: string): Promise<PropertyUnitLocationResponse | null> {
        const isPropertyUnitExisting = await this.propertyUnitLocationRepository.getPropertyUnitLocationById(id);
        if (!isPropertyUnitExisting) {
            throw new NotFoundError("The property unit location line doesn't exist");
        }

        return {
            id: isPropertyUnitExisting.id,
            unitLocationId: isPropertyUnitExisting.unitLocationId,
            propertyId: isPropertyUnitExisting.propertyId,
            createdAt: isPropertyUnitExisting.createdAt,
            updatedAt: isPropertyUnitExisting.updatedAt,

        }
    }

    //Recuperer toutes les proprietes paginé
    async getAllpropertyUnitLocations(
        page: number,
        limit: number
    ): Promise<PaginatedResult<PropertyUnitLocationResponse>> {

        const { rows, count } =
            await this.propertyUnitLocationRepository
                .getPropertyUnitLocationPaginated(page, limit);

        const mappedData = rows.map((objects) => ({
            id: objects.id,
            unitLocationId: objects.unitLocationId,
            propertyId: objects.propertyId,
            createdAt: objects.createdAt,
            updatedAt: objects.updatedAt
        }));

        return {
            data: mappedData,
            total: count
        };
    }

    async updatepropertyUnitLocation(
        id: string,
        data: Partial<CreatepropertyUnitLocationInput>,
    ): Promise<PropertyUnitLocationResponse> {
        const existingPropertyUnitLocation = await this.propertyUnitLocationRepository.getPropertyUnitLocationById(id);
        if (!existingPropertyUnitLocation) {
            throw new NotFoundError("The property unit location line doesn/'t exist");
        }
        const modifyData = await this.propertyUnitLocationRepository.updatePropertyUnitLocation(id, data);
        return {
            id: modifyData.id,
            unitLocationId: modifyData.unitLocationId,
            propertyId: modifyData.propertyId,
            createdAt: modifyData.createdAt,
            updatedAt: modifyData.updatedAt,

        }
    }

    //Implementer le soft delete
    async deletepropertyUnitLocation(id: string): Promise<boolean> {
        const deleted = await this.propertyUnitLocationRepository.getPropertyUnitLocationById(id);
        if (!deleted) {
            throw new NotFoundError("Property unit location not found")
        }
        deleted.destroy();
        return true;
    }
}
