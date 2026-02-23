import { PropertyTypeRepository } from "./propertyType.repository";
import { CreatePropertyTypeInput } from "./propertyType.schema";


export class PropertyTypeService {

    private propertyTypeRepository: PropertyTypeRepository;

    constructor() {
        this.propertyTypeRepository = new PropertyTypeRepository();
    }

    async createPropertyType(data: CreatePropertyTypeInput) {
        const existingPropertyType = await this.propertyTypeRepository.getPropertyTypeByLabel(data.label);
        console.log(existingPropertyType)

        if (existingPropertyType) {
            return null;
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

    async getPropertyTypeById(id: string) {
        const PropertyType = await this.propertyTypeRepository.getPropertyTypeById(id);
        if (!PropertyType) {
            return null;
        }
        return PropertyType;
    }

    async getAllPropertyTypes() {
        return this.propertyTypeRepository.getAllPropertyTypes();
    }

    async getPropertyTypePaginated(page: number, limit: number) {
        return this.propertyTypeRepository.getPropertyTypePaginated(page, limit);
    }

    async updatePropertyType(id: string, data: Partial<CreatePropertyTypeInput>) {
        const updatedPropertyType = await this.propertyTypeRepository.updatePropertyType(id, data);
        if (!updatedPropertyType) {
            return null;
        }
        return updatedPropertyType;
    }

    async deletePropertyType(id: string) {
        const deleted = await this.propertyTypeRepository.deletePropertyType(id);
        if (!deleted) {
            throw new Error('PropertyType not found');
        }
        return true;
    }

}