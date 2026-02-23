import { PropertyRepository } from "./property.repository";
import { CreatePropertyInput } from "./property.schema";


export class PropertyService {

    private propertyRepository: PropertyRepository;

    constructor() {
        this.propertyRepository = new PropertyRepository();
    }

    async createProperty(data: CreatePropertyInput) {
        const existingProperty = this.propertyRepository.getPropertyByName(data.name);

        if (!existingProperty) {
            return null;
        }

        const property = (await this.propertyRepository.createProperty({
            name:data.name,
            type:data.type,
            address:data.address,
            city:data.city,
            district:data.district,
            country:data.country,
            numberOfUnits:data.numberOfUnits,
            numberOfFloors:data.numberOfFloors,
            yearBuilt:data.yearBuilt,
            description:data.description,
            electricityMeterNumber:data.electricityMeterNumber,
            waterMeterNumber:data.waterMeterNumber,
            documents:data.documents,
        }));

        return {
            id:property.id,
            name:property.name,
            type:property.type,
            address:property.address,
            city:property.city,
            district:property.district,
            country:property.country,
            numberOfUnits:property.numberOfUnits,
            numberOfFloors:property.numberOfFloors,
            yearBuilt:property.yearBuilt,
            description:property.description,
            electricityMeterNumber:property.electricityMeterNumber,
            waterMeterNumber:property.waterMeterNumber,
            documents:property.documents,
            createdAt:property.createdAt,
            updatedAt:property.updatedAt,
        }

    }

    async getPropertyById(id: string) {
        const property = await this.propertyRepository.getPropertyById(id);
        if (!property) {
            return null;
        }
        return property;
    }

    async getAllPropertys() {
        return this.propertyRepository.getAllProperty();
    }

    async getPropertyPaginated(page: number, limit: number) {
        return this.propertyRepository.getPropertyPaginated(page, limit);
    }

    async updateProperty(id: string, data: Partial<CreatePropertyInput>) {
        const updatedProperty = await this.propertyRepository.updateProperty(id, data);
        if (!updatedProperty) {
            return null;
        }
        return updatedProperty;
    }

    async deleteProperty(id: string) {
        const deleted = await this.propertyRepository.deleteProperty(id);
        if (!deleted) {
            throw new Error('Property not found');
        }
        return true;
    }

}