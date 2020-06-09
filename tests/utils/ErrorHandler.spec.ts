import { CustomError, NodeEnv } from "utils/ErrorHandler";
import { HttpError } from "routing-controllers";

describe('ErrorHandler', () => {
    beforeEach(() => {
        expect.hasAssertions();
        process.env.NODE_ENV = null;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("CustomError is an instance of HttpError", () => {
        expect(new CustomError(404, 'Not Found')).toBeInstanceOf(HttpError);
    });

    test("CustomError initializes properties correctly", () => {
        const statusCode = 404;
        const message = 'Not Found';
        const testArg = { errorDescription: 'test error' };
        const err = new CustomError(statusCode, message, [testArg]);

        expect(err.httpCode).toStrictEqual(statusCode);
        expect(err.message).toStrictEqual(message);
        expect(err.args).toStrictEqual([testArg]);
    });

    test("CustomError method 'toJSON' called with NODE_ENV='production' returns an error object without stack trace", () => {
        const statusCode = 404;
        const message = 'Not Found';
        const testArg = { errorDescription: 'test error' };
        const err = new CustomError(statusCode, message, [testArg]);

        process.env.NODE_ENV = NodeEnv.PROD;

        expect(err.toJSON()).toStrictEqual({
            name: err.name,
            status: err.httpCode,
            message: err.message
        });
    });

    test("CustomError method 'toJSON' called with NODE_ENV='development' returns an error object with stack trace", () => {
        const statusCode = 404;
        const message = 'Not Found';
        const testArg = { errorDescription: 'test error' };
        const err = new CustomError(statusCode, message, [testArg]);

        process.env.NODE_ENV = NodeEnv.DEV;

        expect(err.toJSON()).toStrictEqual({
            name: err.name,
            status: err.httpCode,
            message: err.message,
            stack: err.stack
        });
    });

});
