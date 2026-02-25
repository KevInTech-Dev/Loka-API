import { NotFoundError } from "@/common/errors";
import { PropertyUnitLocation, PropertyUnitLocationCreationAttributes } from "@/database/models/PropertyUnitLocation";
import { ModelStatic } from "sequelize";


export class PropertyUnitLocationRepository {
    private PropertyUnitLocation: ModelStatic<PropertyUnitLocation>

    constructor() {
        this.PropertyUnitLocation = PropertyUnitLocation;
    }

    async createPropertyUnitLocation(data: PropertyUnitLocationCreationAttributes) {
        return this.PropertyUnitLocation.create(data);
    }

    async getPropertyUnitLocationById(id: string) {
        return this.PropertyUnitLocation.findByPk(id);
    }

    async getPropertyUnitLocationPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.PropertyUnitLocation.findAndCountAll({ offset, limit });
    }

    async updatePropertyUnitLocation(id: string, data: Partial<PropertyUnitLocationCreationAttributes>) {
        const PropertyUnitLocation = await this.getPropertyUnitLocationById(id);
        if (!PropertyUnitLocation) { throw new NotFoundError("Id not found") };

        await PropertyUnitLocation.update(data);
        return PropertyUnitLocation;
    }

    // async deletePropertyUnitLocation(id: string) {
    //     const PropertyUnitLocation = await this.getPropertyUnitLocationById(id);
    //     if (!PropertyUnitLocation) return false;

    //     await PropertyUnitLocation.destroy();
    //     return true;
    // }

}