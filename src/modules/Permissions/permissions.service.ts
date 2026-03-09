import { permissionsCreationAttributes } from "@/database/models/Permissions";
import { PermissionsRepository } from "../Permissions/permissions.repository";
import { PermissionsResponse } from "./permissions.type";
import { CreatePermissionsSchema } from "./permissions.schema";
import { NotFoundError } from "@/common/errors";

export class PermissionsService {
    private permissionsRepository: PermissionsRepository;

    constructor() {
        this.permissionsRepository = this.permissionsRepository;
    }

    createPermissions = async (data: CreatePermissionsSchema): Promise<PermissionsResponse> => {
        const dataToCreate = await this.permissionsRepository.create({
            titre: data.titre,
            permissions: data.permission
        })
        return {
            id: dataToCreate.id,
            titre: dataToCreate.titre,
            permissions: dataToCreate.permissions,
            createdAt: dataToCreate.createdAt,
            updatedAt: dataToCreate.updatedAt
        }
    }

    updatePermissions = async (id: string, data: Partial<CreatePermissionsSchema>): Promise<PermissionsResponse> => {
        const existingPermissions = await this.permissionsRepository.findById(id);
        if (!existingPermissions) {
            throw new NotFoundError("The permisssion was")
        }

        const modifyPermission = await this.permissionsRepository.update(id, data);
        if (!modifyPermission) {
            throw new Error("Error when updating the permission")
        }

        return {
            id: modifyPermission.id,
            titre: modifyPermission.titre,
            permissions: modifyPermission.permissions,
            createdAt: modifyPermission.createdAt,
            updatedAt: modifyPermission.updatedAt
        }

    }

    deletePermissions = async (id: string): Promise<boolean> => {

        const existingPermission = await this.permissionsRepository.findById(id);
        if (!existingPermission) {
            throw new NotFoundError("The permission was")
        }
        await this.permissionsRepository.softDelete(id);
        return true;
    }

    getAllPermissions = async (page: number, limit: number): Promise<PermissionsResponse[]> => {
        return (await this.permissionsRepository.getPermissionsPaginated(page, limit)).map(
            (permissions) => {
                return {
                    id: permissions.id,
                    titre: permissions.titre,
                    permissions: permissions.permissions,
                    createdAt: permissions.createdAt,
                    updatedAt: permissions.updatedAt
                }
            }
        );
    }

    getPermissionsById = async (id: string): Promise<PermissionsResponse> => {
        const permissions = await this.permissionsRepository.findById(id);
        if (!permissions) {
            throw new NotFoundError("Permission");
        }

        return {
            id: permissions.id,
            titre: permissions.titre,
            permissions: permissions.permissions,
            createdAt: permissions.createdAt,
            updatedAt: permissions.updatedAt
        }
    }
}