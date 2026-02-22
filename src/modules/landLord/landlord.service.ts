import { BusinessTypeEnum } from "@/enums/BusinessTypeEnum";
import { landLordRepository } from "./landlord.repository";
import { CreateLandlordInput } from "./landlord.schema";


export  class landLordService {
    private landlordRepository: landLordRepository;

    constructor() {
        this.landlordRepository = new landLordRepository();
    }

    async createlandLord(data: CreateLandlordInput) {

        const landlord = (await this.landlordRepository.createlandLord({
            companyName: data.companyName,
            businessType: BusinessTypeEnum.AGENCE,
            taxId: data.taxId,
            registrationNumber: data.registrationNumber,
            phonePrimary: data.phonePrimary,
            phoneSecondary: data.phoneSecondary,
            address: data.address,
            city: data.city,
            country: data.country,
            isVerified: false
        }));

        return {
            companyName: landlord.companyName,
            businessType: landlord.businessType,
            taxId: landlord.taxId,
            registrationNumber: landlord.registrationNumber,
            phonePrimary: landlord.phonePrimary,
            phoneSecondary: landlord.phoneSecondary,
            address: landlord.address,
            city: landlord.city,
            country: landlord.country,
            isVerified: landlord.isVerified
        }
    }

    async getlandLordById(id: string){
        const landlord = await this.landlordRepository.getlandLordById(id);
        if(!landlord) {
            return null;
        }
        return landlord;
    }

    async getAllLandlords() {
        return this.landlordRepository.getAllLandlords();
    }

    async getlandLordPaginated(page: number, limit: number) {
        return this.landlordRepository.getlandLoardPaginated(page, limit);
    }

    async updatelandLord(id: string, data: Partial<CreateLandlordInput>) {
        const updatelandLord = await this.landlordRepository.updatelandLord(id, data);
        if(!updatelandLord) {
            return null;
        }
        return updatelandLord;
    }

    async deletelandLord(id: string) {
        const deleted = await this.landlordRepository.deletelandLord(id);
        if(!deleted) {
            throw new Error("Landlord not found");
        }
        return true;
    }
}