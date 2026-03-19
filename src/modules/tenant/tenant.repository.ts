import { Tenant, TenantCreationAttributes } from "@/database/models/Tenants";
import { User } from "@/database/models/Users";
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
        return this.tenant.findByPk(id, {include:[{
            model: User,
            as: 'tenantUser',
        }]});
    }

    async getTenantPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.tenant.findAll({ offset, limit, include:[
            {
                model: User,
                as: 'tenantUser'
            }
        ]});
    }

    async updateTenant(id: string, data: Partial<TenantCreationAttributes>) {
        const tenant = await this.getTenantById(id);
        if(!tenant) return null
        
        await tenant.update(data, {
            where: {
                id: data.id
            }
        });
        return tenant;
    }

    async deleteTenant(id: string) {
        return await this.tenant.destroy({where: {id}})
    }
}