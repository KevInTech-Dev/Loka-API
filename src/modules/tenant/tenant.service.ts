import {GenderEnum} from "@/enums/GenderEnum";
import {TenantRepository} from "./tenant.repository";
import {CreateTenantInput} from "./tenant.schema";
import {UserService} from "@modules/users/user.service";
import {RoleEnum} from "@/enums/RoleEnum";

export class TenantService {
    private tenantRepository: TenantRepository;
    private userService: UserService


    constructor() {
        this.tenantRepository = new TenantRepository();
        this.userService = new UserService();

    }

    async createTenant(data: CreateTenantInput) {


        const {id: userID, ...user} = await this.userService.createUser({
            email: data.email,
            username: data.username,
            password: data.password,
            role: RoleEnum.LOCATAIRE,
            firstname: data.firstname,
            lastname: data.lastname,
            photo: data.photo
        })


        const tenant = (await this.tenantRepository.createTenant({
            userId: userID,
            date_of_birth: data.date_of_birth,
            gender: data.gender ?? GenderEnum.MASCULIN,
            nationality: data.nationality,
            phone_primary: data.phone_primary,
            phone_secondary: data.phone_secondary,
            id_card_type: data.id_card_type,
            id_card_number: data.id_card_number,
            id_card_front_url: data.id_card_front_url,
            id_card_back_url: data.id_card_back_url,
            occupation: data.occupation,
            employer_name: data.employer_name,
            employer_contact: data.employer_contact,
            emergency_contact_name: data.emergency_contact_name,
            emergency_contact_phone: data.emergency_contact_phone,
            emergenc_contact_relationship: data.emergency_contact_relationship
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
            ...user
        }
    }

    async getTenantById(id: string) {
        const tenant = await this.tenantRepository.getTenantById(id);
        if (!tenant) {
            return null;
        }
        return tenant;
    }

    async getAllTenants() {
        return this.tenantRepository.getAllTenants();
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
        const deleteTenant = await this.tenantRepository.deleteTenant(id);
        if (!deleteTenant) {
            throw new Error("Tenant not found");
        }
        return true;
    }
}