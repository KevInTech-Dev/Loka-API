import { BaseRepositoryImpl } from "@/common/base.repository";
import { NotFoundError } from "@/common/errors";
import { Maintenance, MaintenanceAttributes } from "@/database/models/maintenance";
import { CreationAttributes, Transaction } from "sequelize";

export class MaintenanceRepository extends BaseRepositoryImpl<Maintenance> {
    constructor() {
        super(Maintenance)
    }

    async createMaintenance(data: CreationAttributes<Maintenance>, transaction?: Transaction): Promise<Maintenance> {
        return this.model.create(data, { transaction });
    }

    async findMaintenanceById(id: string) {
        return this.model.findByPk(id);
    }

    async getMaintenancePaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.model.findAndCountAll({ offset, limit })
    }

    async getMaintenanceByAttribut(attribut: keyof MaintenanceAttributes, value: string) {
        return this.model.findOne({
            where: {
                [attribut]: value
            }
        });
    }

    async deleteMaintenance(id: string, transaction?: Transaction): Promise<boolean> {
        //Verifier si cet id existe
        const isExisting = this.model.findByPk(id);
        if (!isExisting) {
            throw new NotFoundError("Maintenance");
        }

        if (await this.softDelete(id)) {
            return true
        } else {
            throw new Error("Error when deleting")
        }

    }
}