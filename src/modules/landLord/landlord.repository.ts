import { LandLord, landLordCreationAtributes } from "@/database/models/landLord";
import { ModelStatic } from "sequelize";

export class landLordRepository{
    private landlord: ModelStatic<LandLord>

    constructor(){
        this.landlord = LandLord;
    }

    async createlandLord(data: landLordCreationAtributes) {
        return this.landlord.create(data);
    }

    async getlandLordById(id: string) {
        return this.landlord.findOne({ where: { id, deletedAt: null } });
    }

     async getlandLordByUserId(userId: string) {
        return this.landlord.findOne({ where: { userId, deletedAt: null } });
    }

    async getAllLandlords(){
        return this.landlord.findAll({ where: { deletedAt: null } });
    }

    async getlandLordPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.landlord.findAll({ where: { deletedAt: null }, offset, limit });
}

    async updatelandLord(id: string, data: Partial<landLordCreationAtributes>){
        const landlord = await this.getlandLordById(id);
        if (!landlord) return null;

        await landlord.update(data);
        return landlord;
    }

    async deletelandLord(id: string) {
        const landlord = await this.getlandLordById(id);
        if(!landlord) return false;

        // Suppression logique 
        await landlord.update({ deletedAt: new Date() });
        return true;
    }

}