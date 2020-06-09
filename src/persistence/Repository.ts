import { IDatabase } from "./Database";
import { Entity } from "./entities/Entity";
import { ObjectProps } from "../types/GeneralTypes";

export class Repository<T extends Entity<T>> implements IDatabase<T> {
    private database: IDatabase<T>;

    constructor(database: IDatabase<T>) {
        this.database = database;
    }

    public async findById(id: string): Promise<T> {
        return await this.database.findById(id);
    }

    public async find(params?: Partial<ObjectProps<T>>): Promise<T[]> {
        return await this.database.find(params);
    }

    public async create(entity: Omit<T, 'id'>): Promise<T> {
        return await this.database.create(entity);
    }

    public async update(
        id: string,
        partialEntity: Omit<Partial<ObjectProps<T>>, 'id'>,
    ): Promise<T> {
        return await this.database.update(id, partialEntity);
    }

    public async delete(id: string): Promise<boolean> {
        return await this.database.delete(id);
    }
}
