import { BaseTypes } from "@/common/models/base.model";
import { permissionsAttributes } from "@/database/models/Permissions";


export type PermissionsResponse = BaseTypes & {
    titre: string;
    permissions: string;
}

export type WhereQueryPermissions = {
    [key in keyof permissionsAttributes]?: string | number | boolean;
};