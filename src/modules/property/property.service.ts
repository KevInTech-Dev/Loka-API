import { DuplicateEntryError } from "@/common/errors";
import { PropertyTypeRepository } from "../propertyType/propertyType.repository";
import { PropertyTypeIdParams } from "../propertyType/propertyType.schema";
import { PropertyRepository } from "./property.repository";
import { CreatePropertyInput } from "./property.schema";


export class PropertyService {

    //Injection des repository
    private propertyRepository: PropertyRepository;
    private propertyTypeRepository: PropertyTypeRepository;

    //initialisation dans le constructeur
    constructor() {
        this.propertyRepository = new PropertyRepository();
        this.propertyTypeRepository = new PropertyTypeRepository();
    }

    //methode de creation des propriete
    async createProperty(data: CreatePropertyInput) {
        const existingProperty = await this.propertyRepository.getPropertyByName(data.label);
        if (existingProperty) {
            throw new DuplicateEntryError("This property already exists ")
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

    //methode pour recuperer les propriete par Id
    async getPropertyById(id: string) {
        const property = await this.propertyRepository.getPropertyById(id);
        if (!property) {
            throw new Error("The property does not exists");
        }
        return property;
    }

    //methode pour recuperer toutes les propriete paginé
    async getAllPropertys(page: number, limit: number) {
        return this.propertyRepository.getPropertyPaginated(page, limit);
    }

    //methode pour modifier les propriete
    async updateProperty(id: string, data: Partial<CreatePropertyInput>) {
        //verifier l'existance de l'id de la propriete
        const existingProperty = await this.propertyRepository.getPropertyById(id);
        if (!existingProperty) {
            throw new Error("The property doesn't exist");
        }
        const verifyPropertyType = await this.propertyTypeRepository.getPropertyTypeById(data.type);
        if (verifyPropertyType) {
            const updatedProperty = await this.propertyRepository.updateProperty(id, data);
            return updatedProperty;
        } else if (!verifyPropertyType) {
            throw new Error("The property type does not exist , please check");
        }
    }

    //methode pour supprimer les propriete
    async deleteProperty(id: string) {
        const deleted = await this.propertyRepository.deleteProperty(id);
        if (!deleted) {
            throw new Error('Property not found');
        }
        return true;
    }

}