import { DbConnection } from "utils/Enums";
import { dummyId, omitProps, pickProps } from "utils/Functions";
import { ObjectId } from "mongodb";

describe('Functions', () => {
    beforeEach(() => {
        expect.hasAssertions();
        process.env.DB_CONNECTION = null;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("dummyId is called with DB_CONNECTION='mongodb' and returns a BSON ObjectId", () => {
        process.env.DB_CONNECTION = DbConnection.MONGODB;
        const id = dummyId();

        expect(ObjectId.isValid(id)).toStrictEqual(true);
    });

    test("dummyId is called with invalid DB_CONNECTION and returns null", () => {
        process.env.DB_CONNECTION = null;
        const id = dummyId();

        expect(id).toStrictEqual(null);
    });

    test("omitProps returns an object with the correct omitted props", () => {
        const inputtedObject = {
            title: 'test',
            num: 56,
            name: 'test_test'
        }

        const expectedObject = {
            name: 'test_test'
        }

        expect(omitProps(inputtedObject, ['title', 'num'])).toStrictEqual(expectedObject);
    });

    test("omitProps doesn't mutate the initial Object", () => {
        const initialObject = {
            title: 'test',
            num: 56,
            name: 'test_test'
        }

        omitProps(initialObject, ['title', 'num']);

        expect(initialObject).toStrictEqual(initialObject);
    });

    test("pickProps returns an object with the correct picked props", () => {
        const inputtedObject = {
            title: 'test',
            num: 56,
            name: 'test_test'
        }

        const expectedObject = {
            name: 'test_test'
        }

        expect(pickProps(inputtedObject, ['name'])).toStrictEqual(expectedObject);
    })

    test("pickProps doesn't mutate the initial Object", () => {
        const initialObject = {
            title: 'test',
            num: 56,
            name: 'test_test'
        }

        pickProps(initialObject, ['title', 'num']);

        expect(initialObject).toStrictEqual(initialObject);
    });

});
