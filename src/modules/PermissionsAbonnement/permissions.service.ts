import { NotFoundError } from "@/common/errors";
import { PermissionsAbonnementRepository } from "../PermissionsAbonnement/permissionsAbonnement.repository"
import { PermissionsAbonnementSchema } from "./permissions.schema";
import { PermissionAbonnementResponse } from "./permissions.type";


export class PermissionsAbonnementService {

    private permissionsAbonnementRepository: PermissionsAbonnementRepository;

    constructor() {
        this.permissionsAbonnementRepository = this.permissionsAbonnementRepository;
    }

    createPermissionsAbonnement = async (data: PermissionsAbonnementSchema): Promise<PermissionAbonnementResponse> => {
        const dataToCreate = await this.permissionsAbonnementRepository.create({
            idAbonnement: data.idAbonnement,
            idPermissions: data.idPermission
        })

        return {
            id: dataToCreate.id,
            idAbonnement: dataToCreate.idAbonnement,
            idPermissions: dataToCreate.idPermissions,
            createdAt: dataToCreate.createdAt,
            updatedAt: dataToCreate.updatedAt
        }
    }

    updatePermissionsAbonnement = async (id: string, data: Partial<PermissionsAbonnementSchema>): Promise<PermissionAbonnementResponse> => {
        const existingPermissionsAbonnment = await this.permissionsAbonnementRepository.findById(id);
        if (!existingPermissionsAbonnment) {
            throw new NotFoundError("Permission abonnment");
        }

        const dataUpdated = await this.permissionsAbonnementRepository.update(id, data);
        if (!dataUpdated) {
            throw Error("Error when updating")
        }

        return {
            id: dataUpdated.id,
            idAbonnement: dataUpdated.idAbonnement,
            idPermissions: dataUpdated.idPermissions,
            createdAt: dataUpdated.createdAt,
            updatedAt: dataUpdated.updatedAt
        }
    }

    deletePermissionsAbonnement = async (id: string): Promise<boolean> => {
        const existingPermissionsAbonnment = await this.permissionsAbonnementRepository.findById(id);
        if (!existingPermissionsAbonnment) {
            throw new NotFoundError("Permission abonnment")
        }
        await this.permissionsAbonnementRepository.softDelete(id);
        return true;
    }

    getAllPermissionsAbonnement = async (page: number, limit: number): Promise<PermissionAbonnementResponse[]> => {
        return (await this.permissionsAbonnementRepository.getPermissionsAbonnementPaginated(page, limit)).map(
            (permissionAbonnment) => {
                return {
                    id: permissionAbonnment.id,
                    idAbonnement: permissionAbonnment.idAbonnement,
                    idPermissions: permissionAbonnment.idPermissions,
                    createdAt: permissionAbonnment.createdAt,
                    updatedAt: permissionAbonnment.updatedAt
                };
            },
        );
    }

    getPermissionsAbonnementById = async (id: string): Promise<PermissionAbonnementResponse> => {
        const checkExistingId = await this.permissionsAbonnementRepository.findById(id);
        if (!checkExistingId) {
            throw new NotFoundError("Permissions Abonnement");
        }
        return {
            id: checkExistingId.id,
            idAbonnement: checkExistingId.idAbonnement,
            idPermissions: checkExistingId.idPermissions,
            createdAt: checkExistingId.createdAt,
            updatedAt: checkExistingId.updatedAt
        }
    }
}