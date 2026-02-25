import { DuplicateEntryError, InternalServerError, NotFoundError } from "@/common/errors";
import { PropertyTypeRepository } from "./propertyType.repository";
import { CreatePropertyTypeInput } from "./propertyType.schema";
import { PropertyTypeResponse } from "./propertyType.type";
import { PaginatedResult } from "@/common/paginatedResult";


export class PropertyTypeService {

    private propertyTypeRepository: PropertyTypeRepository;

    constructor() {
        this.propertyTypeRepository = new PropertyTypeRepository();
    }

    //Creation d'un type de propriete
    async createPropertyType(data: CreatePropertyTypeInput): Promise<PropertyTypeResponse> {
        const existingPropertyType = await this.propertyTypeRepository.getPropertyTypeByLabel(data.label);
        if (existingPropertyType) {
            throw new DuplicateEntryError("Property type already exist");
        }

        const propertyType = (await this.propertyTypeRepository.createPropertyType({
            label: data.label,
        }));

        return {
            id: propertyType.id,
            label: propertyType.label,
            createdAt: propertyType.createdAt,
            updatedAt: propertyType.updatedAt,
        }

    }

    //Recuperation du type de propriete par id
    async getPropertyTypeById(id: string): Promise<PropertyTypeResponse> {
        const propertyType = await this.propertyTypeRepository.getPropertyTypeById(id);
        if (!propertyType) {
            throw new NotFoundError("This property type does not exist");
        }
        return {
            id: propertyType.id,
            label: propertyType.label,
            createdAt: propertyType.createdAt,
            updatedAt: propertyType.updatedAt
        };
    }

    //Recuparation de tout les  types de proprietes paginé
    async getAllPropertyTypes(page: number, limit: number): Promise<PaginatedResult<PropertyTypeResponse>> {
        const { rows, count } = await this.propertyTypeRepository.getPropertyTypePaginated(page, limit);
        const mappedData = rows.map((objects) => ({
            id: objects.id,
            label: objects.label,
            createdAt: objects.createdAt,
            updatedAt: objects.updatedAt
        }))
        return {
            data: mappedData,
            total: count
        }
    }

    //Modification du type de propriete
    async updatePropertyType(id: string, data: Partial<CreatePropertyTypeInput>): Promise<PropertyTypeResponse> {
        //verifier l'existance du type de propriete
        const existingPropertyType = await this.propertyTypeRepository.getPropertyTypeById(id);
        if (!existingPropertyType) {
            throw new NotFoundError("The property type does not exist");
        }
        const updatedPropertyType = await this.propertyTypeRepository.updatePropertyType(id, data);
        if (!updatedPropertyType) {
            throw new InternalServerError("The update of the property type failed");
        }
        return {
            id: updatedPropertyType.id,
            label: updatedPropertyType.label,
            createdAt: updatedPropertyType.createdAt,
            updatedAt: updatedPropertyType.updatedAt
        };
    }

    //Suppression du type de propriete
    // async deletePropertyType(id: string):Promise<PropertyTypeResponse> {
    //     const deleted = await this.propertyTypeRepository.deletePropertyType(id);
    //     if (!deleted) {
    //         throw new Error('PropertyType not found');
    //     }
    //     return true;
    // }

}