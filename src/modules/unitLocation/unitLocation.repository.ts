import { UnitLocation, UnitLocationCreationAttributes } from "@/database/models/UnitLocation";
import { ModelStatic } from "sequelize";


export class UnitLocationRepository {
    private unitLocation: ModelStatic<UnitLocation>

    constructor() {
        this.unitLocation = UnitLocation;
    }

    async createUnitLocation(data: UnitLocationCreationAttributes) {
        return this.unitLocation.create(data);
    }

    async getUnitLocationById(id: string) {
        return this.unitLocation.findByPk(id);
    }

    async getAllUnitLocations() {
        return this.unitLocation.findAll();
    }

    async getUnitLocationPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.unitLocation.findAll({ offset, limit });
    }

    async updateUnitLocation(id: string, data: Partial<UnitLocationCreationAttributes>) {
        const unitLocation = await this.getUnitLocationById(id);
        if (!unitLocation) return null;

        await unitLocation.update(data);
        return unitLocation;
    }

    async deleteUnitLocation(id: string) {
        const unitLocation = await this.getUnitLocationById(id);
        if (!unitLocation) return false;

        await unitLocation.destroy();
        return true;
    }

    getUnitLocationByUnitName(unitName: string) {
        return this.unitLocation.findOne({ where: { unitName } });
    }
}