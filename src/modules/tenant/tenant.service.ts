import {GenderEnum} from "@/enums/GenderEnum";
import {TenantRepository} from "./tenant.repository";
import {UserService} from "@modules/users/user.service";
import {RoleEnum} from "@/enums/RoleEnum";
import { TenantReponse } from "./tenant.type";
import { NotFoundError } from "@/common/errors";
import { CreateTenantInput } from "./tenant.schema";
import { deleteFile, fileExists } from "@/utils/file.utils";

export class TenantService {
    private tenantRepository: TenantRepository;
    private userService: UserService


    constructor() {
        this.tenantRepository = new TenantRepository();
        this.userService = new UserService();

    }

    async createTenant(data: CreateTenantInput): Promise<TenantReponse | null> {

        const {id: userID, ...user} = await this.userService.createUser({
            email: data.email,
            username: data.username,
            password: data.password,
            role: RoleEnum.LOCATAIRE,
            firstname: data.firstname,
            lastname: data.lastname,
            photo: data.photo,
            phoneNumber: data.phoneNumber,
        })


        const tenant = (await this.tenantRepository.createTenant({
            userId: userID,
            date_of_birth: data.date_of_birth,
            gender: data.gender ?? GenderEnum.MASCULIN,
            nationality: data.nationality,
            phone_primary: data.phone_primary,
            phone_secondary: data.phone_secondary,
            id_card_number: data.id_card_number,
            id_card_type: data.id_card_type,
            id_card_front_url: data.id_card_front_url,
            id_card_back_url: data.id_card_back_url,
            occupation: data.occupation,
            employer_name: data.employer_name,
            employer_contact: data.employer_contact,
            emergency_contact_name: data.emergency_contact_name,
            emergency_contact_phone: data.emergency_contact_phone,
            emergency_contact_relationship: data.emergency_contact_relationship
        }));

        return {
            id: tenant.id,
            userId: tenant.userId,
            date_of_birth: tenant.date_of_birth,
            gender: tenant.gender,
            nationality: tenant.nationality,
            phone_primary: tenant.phone_primary,
            phone_secondary: tenant.phone_secondary,
            id_card_type: tenant.id_card_type,
            id_card_number: tenant.id_card_number,
            id_card_front_url: tenant.id_card_front_url,
            id_card_back_url: tenant.id_card_back_url,
            occupation: tenant.occupation,
            employer_name: tenant.employer_name,
            employer_contact: tenant.employer_contact,
            emergency_contact_name: tenant.emergency_contact_name,
            emergency_contact_phone: tenant.emergency_contact_phone,
            emergency_contact_relationship: tenant.emergenc_contact_relationship,
            createdAt: tenant.createdAt,
            updatedAt: tenant.updatedAt,
            ...user
        }
    }

    async addCardPhoto(id: string, files: { front?: Express.Multer.File, back?: Express.Multer.File }){
        const tenant = await this.getTenantById(id);

        if(!tenant) {
            throw new NotFoundError("Tenant");
        }

        const updateData: any = {};

        if (files.front) {
            if (tenant.id_card_front_url && fileExists(tenant.id_card_front_url)) {
                deleteFile(tenant.id_card_front_url);
            }
            updateData.id_card_front_url = files.front.path;
        }

        if (files.back) {
            if (tenant.id_card_back_url && fileExists(tenant.id_card_back_url)) {
                deleteFile(tenant.id_card_back_url);
            }
            updateData.id_card_back_url = files.back.path;
        }

            return await this.tenantRepository.updateTenant(id, updateData);

    }

    async getTenantById(id: string): Promise<TenantReponse | null>{
        const tenant = await this.tenantRepository.getTenantById(id);
        if (!tenant) {
            throw new NotFoundError("Tenant");
        }
        return tenant
    }

    async getTenantPaginated(page: number, limit: number) {
        return this.tenantRepository.getTenantPaginated(page, limit);
    }

    async updateTenant(id: string, data: Partial<CreateTenantInput>) {
        const updateTenant = await this.tenantRepository.updateTenant(id, data);
        if (!updateTenant) {
            return null;
        }

        return updateTenant;
    }

    async deleteTenant(id: string) {
        return  await this.tenantRepository.deleteTenant(id);
       
    }
}