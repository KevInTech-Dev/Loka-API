import { NotFoundError } from "@/common/errors";
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

    async getUnitTypePaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.unitType.findAndCountAll({ offset, limit });
    }

    async updateUnitType(id: string, data: Partial<UnitTypeCreationAttributes>) {
        const unitType = await this.getUnitTypeById(id);
        if (!unitType) {
            throw new NotFoundError("Id not found")
        };

        await unitType.update(data);
        return unitType;
    }

    // async deleteUnitType(id: string) {
    //     const unitType = await this.getUnitTypeById(id);
    //     if (!unitType) {
    //         throw new NotFoundError("Id not found")
    //     };

    //     await unitType.destroy();
    //     return true;
    // }

    getUnitTypeByLabel(label: string) {
        return this.unitType.findOne({ where: { label } });
    }
}