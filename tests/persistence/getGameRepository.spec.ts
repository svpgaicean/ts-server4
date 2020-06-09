import { DbConnection } from "utils/Enums";

jest.mock('persistence/Repository')
jest.mock('persistence/mongodb/MongoDB')

describe('getGameRepository', () => {
    beforeEach(() => {
        expect.hasAssertions();
        jest.resetModules();
        process.env.DB_CONNECTION = null;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("getGameRepo creates MongoDB Repository if DB_CONNECTION = 'mongodb'", () => {
        const
            { getGameRepo } = require("persistence/getGameRepository"),
            { Repository } = require("persistence/Repository"),
            { MongoDB } = require("persistence/mongodb/MongoDB")

        process.env.DB_CONNECTION = DbConnection.MONGODB;
        expect(getGameRepo()).toBeInstanceOf(Repository);
        expect(Repository).toHaveBeenCalledTimes(1);
        expect(MongoDB).toHaveBeenCalledTimes(1);
    });

    test("getGameRepo doesn't create any Repository if DB_CONNECTION has invalid value", () => {
        const
            { getGameRepo } = require("persistence/getGameRepository"),
            { Repository } = require("persistence/Repository");

        expect(Repository).not.toHaveBeenCalled();
        process.env.DB_CONNECTION = 'garbage_value';
        expect(getGameRepo()).toBeNull();
        expect(Repository).not.toHaveBeenCalled();
    });

});
