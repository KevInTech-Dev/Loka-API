import { PropertyTypeRepository } from "../propertyType/propertyType.repository";
import { PropertyTypeIdParams } from "../propertyType/propertyType.schema";
import { PropertyRepository } from "./property.repository";
import { CreatePropertyInput } from "./property.schema";


export class PropertyService {

    private propertyRepository: PropertyRepository;
    private propertyTypeRepository: PropertyTypeRepository;

    constructor() {
        this.propertyRepository = new PropertyRepository();
        this.propertyTypeRepository = new PropertyTypeRepository();
    }

    async createProperty(data: CreatePropertyInput) {
        const existingProperty = await this.propertyRepository.getPropertyByName(data.label);

        if (existingProperty) {
            throw new Error("This property already exists please")
        }

        //Verifier l'existance du type de propriété
        const existingPropertyType = await this.propertyTypeRepository.getPropertyTypeById(data.type);
        if (!existingPropertyType) {
            throw new Error("This property type does not exits, please enter a valide property type")
        }


        const property = (await this.propertyRepository.createProperty({
            label: data.label,
            type: data.type,
            address: data.address,
            city: data.city,
            district: data.district,
            country: data.country,
            numberOfUnits: data.numberOfUnits,
            numberOfFloors: data.numberOfFloors,
            yearBuilt: data.yearBuilt,
            description: data.description,
            electricityMeterNumber: data.electricityMeterNumber,
            waterMeterNumber: data.waterMeterNumber,
            documents: null
        }));

        return {
            id: property.id,
            label: property.label,
            type: property.type,
            address: property.address,
            city: property.city,
            district: property.district,
            country: property.country,
            numberOfUnits: property.numberOfUnits,
            numberOfFloors: property.numberOfFloors,
            yearBuilt: property.yearBuilt,
            description: property.description,
            electricityMeterNumber: property.electricityMeterNumber,
            waterMeterNumber: property.waterMeterNumber,
            documents: property.documents,
            createdAt: property.createdAt,
            updatedAt: property.updatedAt,
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
        const verifyPropertyType = await this.propertyTypeRepository.getPropertyTypeById(data.type);
        if (verifyPropertyType) {
            const updatedProperty = await this.propertyRepository.updateProperty(id, data);
            return updatedProperty;
        } else if (!verifyPropertyType) {
            throw new Error("The property type does not exist , please check");
        }
    }

    async deleteProperty(id: string) {
        const deleted = await this.propertyRepository.deleteProperty(id);
        if (!deleted) {
            throw new Error('Property not found');
        }
        return true;
    }

}