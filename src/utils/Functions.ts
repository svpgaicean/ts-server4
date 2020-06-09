import { DbConnection } from "./Enums";
import { ObjectId } from "mongodb";
import { PropNames } from "../types/GeneralTypes";

export function dummyId(): string {
    switch (process.env.DB_CONNECTION) {
        case DbConnection.MONGODB:
            return new ObjectId().toHexString();

        default:
            return null;
    }
}

export function omitProps<T>(originalObj: T = <T>{}, paths: PropNames<T>[] = []): T {
    // does not work with flattened paths
    const clonedObj = { ...originalObj };

    for (const path of paths) {
        delete clonedObj[path];
    }

    return clonedObj;
}

export function pickProps<T>(originalObj: T = <T>{}, paths: PropNames<T>[] = []): T {
    // does not work with flattened paths
    const clonedObj = { ...originalObj };
    const keys = Object.keys(clonedObj);
    const pathStrings: string[] = paths;

    keys.forEach((key) => {
        if (!pathStrings.includes(key)) {
            delete clonedObj[key];
        }
    });

    return clonedObj;
}
