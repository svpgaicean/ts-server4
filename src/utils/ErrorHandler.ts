import { STATUS_CODES } from 'http';
import { HttpError } from "routing-controllers/http-error/HttpError";

export class CustomError extends HttpError {
    public name: string;
    public message: string;
    public args: any[];

    constructor(httpCode: number, message: string = null, args: any[] = []) {
        super(httpCode);
        Object.setPrototypeOf(this, CustomError.prototype);
        this.name = STATUS_CODES[httpCode];
        this.message = message;
        this.args = args; // can be used for internal logging

        if (process.env.NODE_ENV === NodeEnv.DEV)
            HttpError.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        this.args.forEach(a => console.log(a));

        const err = {
            name: this.name,
            status: this.httpCode,
            message: this.message,
        }

        if (process.env.NODE_ENV === NodeEnv.DEV)
            err['stack'] = this.stack

        return err;
    }
}

export enum NodeEnv {
    DEV = 'development',
    PROD = 'production'
}
