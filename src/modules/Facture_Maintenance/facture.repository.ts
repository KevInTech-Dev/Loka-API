import { BaseRepositoryImpl } from "@/common/base.repository";
import { FactureMaintenance, FactureMaintenanceAttributes } from "@/database/models/FacturesMaintenance";
import { CreationAttributes } from "sequelize";


export class FactureMaintenanceRepository extends BaseRepositoryImpl<FactureMaintenance> {
    constructor() {
        super(FactureMaintenance)
    }
    //Creer facture Maintenance 
    async create(data: CreationAttributes<FactureMaintenance>): Promise<FactureMaintenance> {
        return this.model.create(data);
    }

    //Find facture Maintenance by id
    async findById(id: string) {
        return this.model.findByPk(id);
    }

    //Find all paginated facture Maintenance
    async getFactureMaintenancePaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.model.findAndCountAll({ offset, limit })
    }

    //Find Facture Maintenance By Attribut
    async getFactureMaintenanceByAttribut(attribut: keyof FactureMaintenanceAttributes, value: string) {
        return this.model.findOne({
            where: {
                [attribut]: value
            }
        });
    }

    getLastInvNumber = async (): Promise<number> => {
        return this.model.count()
    }

    async isThereInvoice(idTenant: keyof FactureMaintenanceAttributes, value: string) {
        const aujourdhui = new Date();
        return this.model.findOne({
            where: {
                [idTenant]: value,
                dateEmission: aujourdhui
            }
        })
    }

    checkIfInvoiceNumberExist = async (invoiceNumber: string): Promise<FactureMaintenance> => {
        return this.model.findOne({
            where: {
                numeroFacture: invoiceNumber,
            }
        })
    }
}