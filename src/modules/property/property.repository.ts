
import { NotFoundError } from "@/common/errors";
import { Property, PropertyCreationAttributes } from "@/database/models/Property";
import { ModelStatic } from "sequelize";

export class PropertyRepository {
    private Property: ModelStatic<Property>

    constructor() {
        this.Property = Property;
    }

    async createProperty(data: PropertyCreationAttributes) {
        return this.Property.create(data);
    }

    async getPropertyById(id: string) {
        return this.Property.findByPk(id);
    }

    async getPropertyPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.Property.findAndCountAll({ offset, limit });
    }

    async updateProperty(id: string, data: Partial<PropertyCreationAttributes>) {
        const Property = await this.getPropertyById(id);
        if (!Property) { throw new NotFoundError("Id not found") };

        await Property.update(data);
        return Property;
    }

    // async deleteProperty(id: string) {
    //     const Property = await this.getPropertyById(id);
    //     if (!Property) return false;

    //     await Property.destroy();
    //     return true;
    // }

    getPropertyByName(label: string) {
        return this.Property.findOne({ where: { label } });
    }
}