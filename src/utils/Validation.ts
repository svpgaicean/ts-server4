import { IsDefined, Length, IsOptional, IsEmail, IsAscii, Matches } from "class-validator";

export function validateBody<T>
    (subject: Partial<T>, refference: Partial<T>, group: Validation): boolean {
    switch (group) {
        case Validation.PARTIAL: {
            return objIntersection<T>(subject, refference);
        }
        case Validation.FULL: {
            return objDifference<T>(subject, refference);
        }
        case Validation.CREATE: {
            return objDifference<T>(subject, refference);
        }
    }
}

export function objDifference<T>(subj: Partial<T>, reff: Partial<T>): boolean {
    // does not work with flattened paths
    const objects = [subj, reff];
    const allKeys = objects.reduce((keys, object) =>
        keys.concat(Object.keys(object)), []);

    const union = new Set(allKeys);

    return objects.every(object =>
        union.size === Object.keys(object).length);
}

export function objIntersection<T>(subj: Partial<T>, reff: Partial<T>): boolean {
    // does not work with flattened paths
    const intersection = Object.keys(reff).filter(x =>
        Object.keys(subj).includes(x));

    return Object.keys(subj).length <= intersection.length;
}

export function ApiStringField(
    minLen: number,
    maxLen: number,
    array: boolean = false,
    fieldType: StringField = StringField.COMMON
) {

    return function (target: any, propertyKey: string) {
        Length(minLen, maxLen, { always: true, each: array })(target, propertyKey)
        IsOptional({ groups: [Validation.PARTIAL], each: array })(target, propertyKey)
        IsDefined({ groups: [Validation.CREATE, Validation.FULL], each: array })(target, propertyKey)

        switch (fieldType) {
            case StringField.COMMON:
                IsAscii({ always: true, each: array })(target, propertyKey)
                break;
            case StringField.EMAIL:
                IsEmail({}, { always: true })(target, propertyKey)
                break;
        }
    }
}

export function ApiPasswordField(
    minLen: number = 8,
    maxLen: number = 16
) {
    const min = minLen >= 8 ? minLen : 8;
    const max = maxLen >= 16 ? maxLen : 16;

    // min one lowercase, one uppercase, one digit, one symbol
    const pattern = `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{${min},${max}}$`;

    return function (target: any, propertyKey: string) {
        Length(min, max, { always: true })(target, propertyKey)
        IsOptional({ groups: [Validation.PARTIAL, Validation.FULL] })(target, propertyKey)
        IsDefined({ groups: [Validation.CREATE] })(target, propertyKey)
        IsAscii({ always: true })(target, propertyKey)
        Matches(new RegExp(pattern), { always: true })(target, propertyKey)
    }
}

export enum Validation {
    CREATE = 'create',
    FULL = 'full',
    PARTIAL = 'partial',
}

export enum StringField {
    COMMON,
    EMAIL
}
