
import { PropertyType, PropertyTypeCreationAttributes } from "@/database/models/PropertyType";
import { ModelStatic } from "sequelize";

export class PropertyTypeRepository {
    private PropertyType: ModelStatic<PropertyType>

    constructor() {
        this.PropertyType = PropertyType;
    }

    async createPropertyType(data: PropertyTypeCreationAttributes) {
        return this.PropertyType.create(data);
    }

    async getPropertyTypeById(id: string) {
        return this.PropertyType.findByPk(id);
    }

    async getPropertyTypePaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.PropertyType.findAll({ offset, limit });
    }

    async updatePropertyType(id: string, data: Partial<PropertyTypeCreationAttributes>) {
        const PropertyType = await this.getPropertyTypeById(id);
        if (!PropertyType) return null;

        await PropertyType.update(data);
        return PropertyType;
    }

    async deletePropertyType(id: string) {
        const PropertyType = await this.getPropertyTypeById(id);
        if (!PropertyType) return false;

        await PropertyType.destroy();
        return true;
    }

    getPropertyTypeByLabel(label: string) {
        return this.PropertyType.findOne({ where: { label } });
    }
}