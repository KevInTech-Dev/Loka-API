import { UnitType, UnitTypeCreationAttributes } from "@/database/models/UnitType";
import { ModelStatic } from "sequelize";


export class UnitTypeRepository {
    private unitType: ModelStatic<UnitType>

    constructor() {
        this.unitType = UnitType;
    }

    async createUnitType(data: UnitTypeCreationAttributes) {
        return this.unitType.create(data);
    }

    async getUnitTypeById(id: string) {
        return this.unitType.findByPk(id);
    }

    async getAllUnitTypes() {
        return this.unitType.findAll();
    }

    async getUnitTypePaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.unitType.findAll({ offset, limit });
    }

    async updateUnitType(id: string, data: Partial<UnitTypeCreationAttributes>) {
        const unitType = await this.getUnitTypeById(id);
        if (!unitType) return null;

        await unitType.update(data);
        return unitType;
    }

    async deleteUnitType(id: string) {
        const unitType = await this.getUnitTypeById(id);
        if (!unitType) return false;

        await unitType.destroy();
        return true;
    }

    getUnitTypeByLabel(label: string) {
        return this.unitType.findOne({ where: { label } });
    }
}