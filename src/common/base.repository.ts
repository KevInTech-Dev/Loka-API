import {Attributes, CreationAttributes, FindOptions, Model, ModelStatic, Op, UpdateOptions} from "sequelize";
import {sequelize} from "@database/sequelize";


export interface BaseRepository<T extends Model> {
    create(data: CreationAttributes<T>): Promise<T>;

    findById(id: string): Promise<T | null>;

    findAll(options?: FindOptions): Promise<T[]>;

    update(id: string, data: Partial<Attributes<T>>, options?: UpdateOptions): Promise<T | null>;

    delete(id: string, options?: UpdateOptions): Promise<boolean>;
}


export abstract class BaseRepositoryImpl<T extends Model> implements BaseRepository<T> {
    protected model: ModelStatic<T>;
    protected sequelizeInstance: typeof sequelize;
    protected Op: typeof Op;

    constructor(model: ModelStatic<T>) {
        this.model = model;
        this.sequelizeInstance = sequelize;
        this.Op = Op;
    }

    create(data: CreationAttributes<T>): Promise<T> {
        return Promise.resolve(undefined);
    }

    async delete(id: string, options?: UpdateOptions): Promise<boolean> {
        const record = await this.findById(id);
        if (!record) return false;

        await record.destroy({ ...options, force: false });
        return true;
    }

    findAll(option?: FindOptions): Promise<T[]> {
        return this.model.findAll(option)
    }

    findById(id: string): Promise<T | null> {
        return this.model.findByPk(id)
    }

    async update(id: string, data: Partial<Attributes<T>>, options?: UpdateOptions): Promise<T | null> {
        const record = await this.findById(id);
        if (!record) return null;

        await record.update(data, options);
        return record;
    }
}