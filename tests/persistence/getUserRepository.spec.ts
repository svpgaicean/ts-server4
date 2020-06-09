import { DbConnection } from "utils/Enums";

jest.mock('persistence/Repository')
jest.mock('persistence/mongodb/MongoDB')

describe('getUserRepository', () => {
    beforeEach(() => {
        expect.hasAssertions();
        process.env.DB_CONNECTION = null;
    });

    afterEach(() => {
        jest.resetModules();
        jest.resetAllMocks();
    });

    test("getUserRepo creates MongoDB Repository if DB_CONNECTION = 'mongodb'", () => {
        const
            { getUserRepo } = require("persistence/getUserRepository"),
            { Repository } = require("persistence/Repository"),
            { MongoDB } = require("persistence/mongodb/MongoDB")

        process.env.DB_CONNECTION = DbConnection.MONGODB;
        expect(getUserRepo()).toBeInstanceOf(Repository);
        expect(Repository).toHaveBeenCalledTimes(1);
        expect(MongoDB).toHaveBeenCalledTimes(1);
    });

    test("getUserRepo doesn't create any Repository if DB_CONNECTION has invalid value", () => {
        const
            { getUserRepo } = require("persistence/getUserRepository"),
            { Repository } = require("persistence/Repository");

        expect(Repository).not.toHaveBeenCalled();
        process.env.DB_CONNECTION = 'garbage_value';
        expect(getUserRepo()).toBeNull();
        expect(Repository).not.toHaveBeenCalled();
    });

});
