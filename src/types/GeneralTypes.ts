export type PropNames<T> = {
    [K in keyof T]: K extends number | symbol
    ? never // exclude props that have type number | symbol
    : T[K] extends Function
    ? never // exclude props that have key of type Function
    : K
}[keyof T];

export type ObjectProps<T> = Pick<T, PropNames<T>>;

type StringPropNames<T> = {
    [K in keyof T]: K extends number | symbol
    ? never // exclude props that have type number | symbol
    : K
}[keyof T];

type NonFunctionProps<T> = {
    [K in keyof T]: T[K] extends Function
    ? never // exclude props that have key of type Function
    : K
}[keyof T];
