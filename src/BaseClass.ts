import { ObjectProps } from "./types/GeneralTypes";

export abstract class BaseClass<T> {
    constructor(params: ObjectProps<T>) {
        Object.keys(params).forEach((key: string) => {
            this[key] = params[key];
        });
    }
}
