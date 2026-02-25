import { DuplicateEntryError, NotFoundError } from "@/common/errors";
import { PropertyTypeRepository } from "../propertyType/propertyType.repository";
import { PropertyRepository } from "./property.repository";
import { CreatePropertyInput } from "./property.schema";
import { PaginatedResult } from "@/common/paginatedResult";
import { PropertyResponse } from "./property.type";
import { deleteFile, fileExists } from "@/utils/file.utils";


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
    async createProperty(data: CreatePropertyInput): Promise<PropertyResponse> {
        const existingProperty = await this.propertyRepository.getPropertyByName(data.label);
        if (existingProperty) {
            throw new DuplicateEntryError("This property already exists ")
        }

        //Verifier l'existance du type de propriété
        const existingPropertyType = await this.propertyTypeRepository.getPropertyTypeById(data.type);
        if (!existingPropertyType) {
            throw new NotFoundError("This property type does not exits, please enter a valide property type")
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

    async addDocuments(id: string, file: Express.Multer.File) {
        const property = await this.propertyRepository.getPropertyById(id);

        if (!property) {
            throw new NotFoundError("Property Not found");
        }

        try {
            if (property.documents && property.documents.length > 0) {
                if (fileExists(property.documents)) {
                    deleteFile(property.documents)
                }
            }
        } catch (error) {
            console.error(error);
        }


        const updatedProperty = await this.propertyRepository.updateProperty(id, {
            documents: file.path,
        });


        if (!updatedProperty) {
            throw new NotFoundError("Property");
        }

        return {
            id: updatedProperty.id,
            label: updatedProperty.label,
            type: updatedProperty.type,
            address: updatedProperty.address,
            city: updatedProperty.city,
            district: updatedProperty.district,
            country: updatedProperty.country,
            numberOfUnits: updatedProperty.numberOfUnits,
            numberOfFloors: updatedProperty.numberOfFloors,
            yearBuilt: updatedProperty.yearBuilt,
            description: updatedProperty.description,
            electricityMeterNumber: updatedProperty.electricityMeterNumber,
            waterMeterNumber: updatedProperty.waterMeterNumber,
            documents: updatedProperty.documents,
            createdAt: updatedProperty.createdAt,
            updatedAt: updatedProperty.updatedAt,
        };
    }

    //methode pour recuperer les propriete par Id
    async getPropertyById(id: string): Promise<PropertyResponse> {
        const property = await this.propertyRepository.getPropertyById(id);
        if (!property) {
            throw new NotFoundError("The property does not exists");
        }
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
        };
    }

    //methode pour recuperer toutes les propriete paginé
    async getAllPropertys(page: number, limit: number): Promise<PaginatedResult<PropertyResponse>> {
        const { rows, count } =
            await this.propertyRepository
                .getPropertyPaginated(page, limit);

        const mappedData = rows.map((property) => ({
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
        }));

        return {
            data: mappedData,
            total: count
        };
    }

    //methode pour modifier les propriete
    async updateProperty(id: string, data: Partial<CreatePropertyInput>): Promise<PropertyResponse> {
        //verifier l'existance de l'id de la propriete
        const existingProperty = await this.propertyRepository.getPropertyById(id);
        if (!existingProperty) {
            throw new NotFoundError("The property doesn't exist");
        }
        const verifyPropertyType = await this.propertyTypeRepository.getPropertyTypeById(data.type);
        if (verifyPropertyType) {
            const updatedProperty = await this.propertyRepository.updateProperty(id, data);
            return {
                id: updatedProperty.id,
                label: updatedProperty.label,
                type: updatedProperty.type,
                address: updatedProperty.address,
                city: updatedProperty.city,
                district: updatedProperty.district,
                country: updatedProperty.country,
                numberOfUnits: updatedProperty.numberOfUnits,
                numberOfFloors: updatedProperty.numberOfFloors,
                yearBuilt: updatedProperty.yearBuilt,
                description: updatedProperty.description,
                electricityMeterNumber: updatedProperty.electricityMeterNumber,
                waterMeterNumber: updatedProperty.waterMeterNumber,
                documents: updatedProperty.documents,
                createdAt: updatedProperty.createdAt,
                updatedAt: updatedProperty.updatedAt,
            };
        } else if (!verifyPropertyType) {
            throw new NotFoundError("The property type does not exist , please check");
        }
    }

    //methode pour supprimer les propriete
    // async deleteProperty(id: string) {
    //     const deleted = await this.propertyRepository.deleteProperty(id);
    //     if (!deleted) {
    //         throw new Error('Property not found');
    //     }
    //     return true;
    // }

}