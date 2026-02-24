import { BusinessTypeEnum } from "@/enums/BusinessTypeEnum";
import { CreateLandlordInput } from "./landlord.schema";
import { landLordRepository } from "./landlord.repository";
import { UserRepository } from "../users/user.repository";


export  class landLordService {
    private landlordRepository: landLordRepository;
    private userRepository: UserRepository;

    constructor() {
        this.landlordRepository = new landLordRepository();
        this.userRepository = new UserRepository();
    }

    async createlandLord(data: CreateLandlordInput) {
        
        //J'ai généré le numero d'enrégistrement du propriétaire
        const registrationNumber = `REG-${data.userId.substring(0,8)}-${Date.now()}`;

        //  Vérifier que l'utilisateur existe ou pas
        const user = await this.userRepository.getUserById(data.userId);
        if (!user) {
            return null ;
        }

        //  Vérifier que cet utilisateur n'a pas déjà un profil landlord
        const existingLandlord = await this.landlordRepository.getlandLordByUserId(data.userId);
        if (existingLandlord) {
            return null; 
        }

        const landlord = (await this.landlordRepository.createlandLord({
            userId: data.userId,
            companyName: data.companyName,
            businessType: data.businessType ?? BusinessTypeEnum.PARTICULIER,
            taxId: data.taxId,
            registrationNumber: registrationNumber,
            phonePrimary: data.phonePrimary,
            phoneSecondary: data.phoneSecondary,
            address: data.address,
            city: data.city,
            country: data.country,
            isVerified: false
        }));

        return {
            id: landlord.id,
            userId: landlord.userId,
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
        return this.landlordRepository.getlandLordPaginated(page, limit);
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