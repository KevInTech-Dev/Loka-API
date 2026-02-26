import { BaseTypes } from "@/common/models/base.model";
import { BusinessTypeEnum } from "@/enums/BusinessTypeEnum";

export type landLordResponse = BaseTypes & {
        userId: string;
        companyName?: string;
        businessType: BusinessTypeEnum;
        registrationNumber: string;
        taxId: string;
        phonePrimary: string;
        phoneSecondary?: string;
        address: string;
        city?: string;
        country?: string;
        isVerified: boolean;
        deletesAt?: Date | null;
}