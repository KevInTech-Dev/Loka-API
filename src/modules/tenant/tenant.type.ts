import { BaseTypes } from "@/common/models/base.model";
import { GenderEnum } from "@/enums/GenderEnum";

export type TenantReponse = BaseTypes & {
        userId: string;
        date_of_birth : Date;
        gender: GenderEnum;
        nationality: string;
        phone_primary: string;
        phone_secondary?: string;
        id_card_type: string;
        id_card_number: string;
        id_card_front_url?: string;
        id_card_back_url?: string;
        occupation?: string;
        employer_name?: string;
        employer_contact?: string;
        emergency_contact_name? : string;
        emergency_contact_phone?: string;
        emergency_contact_relationship?: string;
        deletedAt?: Date | null;
}