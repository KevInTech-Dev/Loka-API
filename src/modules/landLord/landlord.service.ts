import { BusinessTypeEnum } from "@/enums/BusinessTypeEnum";
import { CreateLandlordInput } from "./landlord.schema";
import { landLordRepository } from "./landlord.repository";
import { UserRepository } from "../users/user.repository";
import { landLordResponse } from "./landlord.types";
import { DuplicateEntryError, NotFoundError } from "@/common/errors";


export  class landLordService {
    private landlordRepository: landLordRepository;
    private userRepository: UserRepository;

    constructor() {
        this.landlordRepository = new landLordRepository();
        this.userRepository = new UserRepository();
    }

    async addLandlordInfo(data: CreateLandlordInput): Promise<landLordResponse | null> {
        
        //J'ai généré le numero d'enrégistrement du propriétaire
        const registrationNumber = `REG-${data.userId.substring(0,8)}-${Date.now()}`;

        //  Vérifier que l'utilisateur existe ou pas
        const user = await this.userRepository.getUserById(data.userId);
        if (!user) {
           throw new NotFoundError("User ");
        }

        //  Vérifier que cet utilisateur n'a pas déjà un profil landlord
        const existingLandlord = await this.landlordRepository.getlandLordByUserId(data.userId);
        if (existingLandlord) {
            throw new DuplicateEntryError("The user already has a landlord profile");
        }

        const landlord = await this.landlordRepository.addLandlordInfo({
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
        });

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
            isVerified: landlord.isVerified,
            createdAt: landlord.createdAt,
            updatedAt: landlord.updatedAt
        }
    }

    async getlandLordById(id: string): Promise<landLordResponse | null>{
        const landlord = await this.landlordRepository.getlandLordById(id);
        if(!landlord) {
            throw new NotFoundError("Landlord ");
        }
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
            isVerified: landlord.isVerified,
            createdAt: landlord.createdAt,
            updatedAt: landlord.updatedAt
        };
    }

    async getAllLandlords(): Promise<landLordResponse[]> {
        return (await this.landlordRepository.getAllLandlords()).map((landlord) => {
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
                isVerified: landlord.isVerified,
                createdAt: landlord.createdAt,
                updatedAt: landlord.updatedAt
            };
        });
    }

    async getlandLordPaginated(page: number, limit: number): Promise<landLordResponse[]> {
        return (await this.landlordRepository.getlandLordPaginated(page, limit)).map(
            (landlord) => {
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
                    isVerified: landlord.isVerified,
                    createdAt: landlord.createdAt,
                    updatedAt: landlord.updatedAt
                };
            },
        );
    }

    async updatelandLord(id: string, data: Partial<CreateLandlordInput>): Promise<landLordResponse | null> {
        const updatelandLord = await this.landlordRepository.updatelandLord(id, data);
        if(!updatelandLord) {
            throw new NotFoundError("Landlord ")
        }
        return {
             id: updatelandLord.id,
            userId: updatelandLord.userId,
            companyName: updatelandLord.companyName,
            businessType: updatelandLord.businessType,
            taxId: updatelandLord.taxId,
            registrationNumber: updatelandLord.registrationNumber,
            phonePrimary: updatelandLord.phonePrimary,
            phoneSecondary: updatelandLord.phoneSecondary,
            address: updatelandLord.address,
            city: updatelandLord.city,
            country: updatelandLord.country,
            isVerified: updatelandLord.isVerified,
            createdAt: updatelandLord.createdAt,
            updatedAt: updatelandLord.updatedAt,
    };
}
    async deletelandLord(id: string): Promise<boolean> {
        const deleted = await this.landlordRepository.deletelandLord(id);
        if(!deleted) {
            throw new Error("Landlord ");
        }
        return true;
    }
}