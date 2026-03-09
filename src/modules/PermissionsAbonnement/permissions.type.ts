import { BaseTypes } from "@/common/models/base.model";
import { permissionsAbonnementAttributes } from "@/database/models/PermissionsAbonnement";
import { UUID } from "node:crypto";

export type PermissionAbonnementResponse = BaseTypes & {
    idAbonnement: string;
    idPermissions: string;
}

export type WhereQueryPermissionsAbonnement = {
    [key in keyof permissionsAbonnementAttributes]?: string | number | boolean;
};