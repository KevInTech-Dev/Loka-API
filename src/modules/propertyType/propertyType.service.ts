import { DuplicateEntryError } from "@/common/errors";
import { PropertyTypeRepository } from "./propertyType.repository";
import { CreatePropertyTypeInput } from "./propertyType.schema";


export class PropertyTypeService {

    private propertyTypeRepository: PropertyTypeRepository;

    constructor() {
        this.propertyTypeRepository = new PropertyTypeRepository();
    }

    //Creation d'un type de propriete
    async createPropertyType(data: CreatePropertyTypeInput) {
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
    async getPropertyTypeById(id: string) {
        const PropertyType = await this.propertyTypeRepository.getPropertyTypeById(id);
        if (!PropertyType) {
            throw new Error("This property type does not exist");
        }
        return PropertyType;
    }

    //Recuparation de tout les  types de proprietes paginé
    async getAllPropertyTypes(page: number, limit: number) {
        return this.propertyTypeRepository.getPropertyTypePaginated(page, limit);
    }

    //Modification du type de propriete
    async updatePropertyType(id: string, data: Partial<CreatePropertyTypeInput>) {
        //verifier l'existance du type de propriete
        const existingPropertyType = await this.propertyTypeRepository.getPropertyTypeById(id);
        if (!existingPropertyType) {
            throw new Error("The property type does not exist");
        }
        const updatedPropertyType = await this.propertyTypeRepository.updatePropertyType(id, data);
        if (!updatedPropertyType) {
            return Error("The update of the property type failed");
        }
        return updatedPropertyType;
    }

    //Suppression du type de propriete
    async deletePropertyType(id: string) {
        const deleted = await this.propertyTypeRepository.deletePropertyType(id);
        if (!deleted) {
            throw new Error('PropertyType not found');
        }
        return true;
    }

}