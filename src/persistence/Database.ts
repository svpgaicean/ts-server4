import { Entity } from "./entities/Entity";
import { ObjectProps } from "../types/GeneralTypes";

export interface IDatabase<T extends Entity<T>> {
    findById(id: string): Promise<T>;

    find(params?: Partial<ObjectProps<T>>): Promise<T[]>;

    create(entity: Omit<T, 'id'>): Promise<T>;

    update(
        id: string,
        partialEntity: Omit<Partial<ObjectProps<T>>, 'id'>
    ): Promise<T>;
    
    delete(id: string): Promise<boolean>;
}
