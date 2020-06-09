import { BaseClass } from "../../BaseClass";

export abstract class Entity<T> extends BaseClass<T> {
    id: string;
};
