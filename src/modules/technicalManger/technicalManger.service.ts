import { NotFoundError } from "@/common/errors";
import { TechnicalMangerMapper } from "./technicalManger.mapper";
import { TechnicalMangerRepository } from "./technicalManger.repository"
import { TechnicalManagerInput } from "./technicalManger.schema"
import { TechnicalManagerResponse } from "./technicalManger.type"

import type { defaultPaginationQueryType } from '@/common/api.schema'

export class TechnicalMangerService {
    private technicalManagerRepository: TechnicalMangerRepository;
    private technicalManagerMapper: TechnicalMangerMapper;
    constructor() {
        this.technicalManagerRepository = new TechnicalMangerRepository();
        this.technicalManagerMapper = new TechnicalMangerMapper()
    }

    createTechnicalManager = async (data: TechnicalManagerInput): Promise<TechnicalManagerResponse> => {
        return await this.technicalManagerRepository.create(this.technicalManagerMapper.toEntity(data));
    }

    updateTechnicalManger = async (id: string, data: TechnicalManagerInput): Promise<TechnicalManagerResponse> => {
        //Verifier l'existance de cet id
        const isExisting = this.technicalManagerRepository.findById(id);
        if (!isExisting) {
            throw new NotFoundError("Technical Manger")
        }

        const updatedTechnicalManager = await this.technicalManagerRepository.update(id, data);
        if (!updatedTechnicalManager) {
            throw new Error("Error when updating")
        }
        return {
            id: updatedTechnicalManager.id,
            title: updatedTechnicalManager.title,
            name: updatedTechnicalManager.name,
            contact: updatedTechnicalManager.contact
        };
    }

    deleteTechnicalManager = async (id: string): Promise<boolean> => {
        //Verifier l'existance de cet id
        const isExisting = this.technicalManagerRepository.findById(id);
        if (!isExisting) {
            throw new NotFoundError("Technical Manger")
        }

        if (await this.technicalManagerRepository.softDelete(id)) {
            return true;
        } else {
            throw new Error("Error when deleting")
        }
    }

    getTechnicalManagerById = async (id: string): Promise<TechnicalManagerResponse> => {
        //Verifier l'existance de cet id
        const isExisting = this.technicalManagerRepository.findById(id);
        if (!isExisting) {
            throw new NotFoundError("Technical Manger")
        }

        const technicalManager = await this.technicalManagerRepository.findById(id);
        if (!technicalManager) {
            throw new NotFoundError("Technical Manger")
        }

        return {
            id: technicalManager.id,
            title: technicalManager.title,
            name: technicalManager.name,
            contact: technicalManager.contact
        }
    }

    getTechnicalMangerPaginated = async ({ page, limit, sortBy, sortOrder, search }: defaultPaginationQueryType) => {
        const { rows, count } = await this.technicalManagerRepository.getTechnicalManagerPaginated({ page, limit, sortBy, search, sortOrder });
        const mappedData = rows.map((object) => ({
            id: object.id,
            title: object.title,
            name: object.name,
            contact: object.contact
        }))
        return {
            data: mappedData,
            total: count
        }
    }
}