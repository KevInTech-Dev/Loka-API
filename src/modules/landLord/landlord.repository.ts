import {NotFoundError} from "@/common/errors";
import {LandLord, landLordCreationAtributes} from "@/database/models/landLord";
import {User} from "@/database/models/Users";
import {ModelStatic} from "sequelize";
import {BaseRepositoryImpl} from "@common/base.repository";

export class landLordRepository extends BaseRepositoryImpl<LandLord> {
    private landlord: ModelStatic<LandLord>

    constructor() {
        super(LandLord);
        this.landlord = LandLord;
    }

    async addLandlordInfo(data: landLordCreationAtributes) {
        return this.landlord.create(data);
    }

    async getlandLordById(id: string) {
        return this.landlord.findByPk(id, {
            include:
                {
                    model: User,
                    as: 'landlordUser'
                }
        });
    }

    async getlandLordByUserId(userId: string) {
        return this.landlord.findOne({where: {userId}})
    }

    async getAllLandlords() {
        return this.landlord.findAll({include: User});
    }

    async getlandLordPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.landlord.findAll({
            offset, limit, include: [{
                model: User,
                as: 'landlordUser'
            }]
        });
    }

    async updatelandLord(id: string, data: Partial<landLordCreationAtributes>) {
        const landlord = await this.getlandLordById(id);
        if (!landlord) return null;

        await landlord.update(data, {
            where: {
                id: data.id
            }
        });
        return landlord;
    }

    async deletelandLord(id: string) {
        const landlord = await this.getlandLordById(id);
        if (!landlord)
            throw new NotFoundError("Landlord");

        // Suppression logique 
        await landlord.destroy();
        return true;
    }

}