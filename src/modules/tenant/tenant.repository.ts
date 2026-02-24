import { Tenant, TenantCreationAttributes } from "@/database/models/Tenants";
import { ModelStatic } from "sequelize";


export class TenantRepository {

    private tenant: ModelStatic<Tenant>

    constructor() {
        this.tenant = Tenant;
    }

    async createTenant(data: TenantCreationAttributes){
        return this.tenant.create(data);
    }

    async getTenantById(id: string) {
        return this.tenant.findByPk(id);
    }

    async getAllTenants() {
        return this.tenant.findAll();
    }

    async getTenantByUserId(userId: string) {
        return this.tenant.findOne({ where: { userId } });
    }

    async getTenantPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.tenant.findAll({offset, limit});
    }

    async updateTenant(id: string, data: Partial<TenantCreationAttributes>) {
        const tenant = await this.getTenantById(id);
        if(!tenant) return null
        
        await tenant.update(data);
        return tenant;
    }

    async deleteTenant(id: string) {
        const tenant = await this.getTenantById(id);
        if (!tenant) return false;

        await tenant.destroy();
        return true;
    }
}