import { landLord, landLordCreationAtributes } from "@/database/models/landLord";
import { ModelStatic } from "sequelize";

export class landLordRepository{
    private landlord: ModelStatic<landLord>

    constructor(){
        this.landlord = landLord;
    }

    async createlandLord(data: landLordCreationAtributes) {
        return this.landlord.create(data);
    }

    async getlandLordById(id: string) {
        return this.landlord.findByPk(id);
    }

    async getAllLandlords(){
        return this.landlord.findAll;
    }

    async getlandLoardPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.landlord.findAll({offset, limit});
    }

    async updatelandLord(id: string, data: Partial<landLordCreationAtributes>){
        const landlord = await this.getlandLordById(id);
        if (!landLord) return null;

        await landlord.update(data);
        return landlord;
    }

    async deletelandLord(id: string) {
        const landlord = await this.getlandLordById(id);
        if(!landlord) return false;

       await landlord.destroy();
       return true;
    }

}