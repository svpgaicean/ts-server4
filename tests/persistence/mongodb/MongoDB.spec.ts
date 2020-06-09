import { Entity } from "persistence/entities/Entity";
import { MongoDB } from "persistence/mongodb/MongoDB";
import { Schema, model, Document } from "mongoose";
import { dummyId, omitProps } from "utils/Functions";
import { DbConnection } from "utils/Enums";

jest.mock('mongoose');

export class TestEntity extends Entity<TestEntity> {
    name: string;
    age: number;
}

export function dummyTestEntity(
    id: string = 'dummy_id',
    name: string = 'dummy_name',
    age: number = 42
): TestEntity {
    return new TestEntity({ id, name, age });
}

export function dummyDocument(
    _id: string = 'dummy_id',
    name: string = 'dummy_name',
    age: number = 42
): Object {
    return {
        toObject: function (): Object {
            return { _id, name, age }
        }
    }
}

describe('MongoDB', () => {
    beforeEach(() => {
        process.env.DB_CONNECTION = DbConnection.MONGODB;
        expect.hasAssertions();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const findMock: jest.Mock = jest.fn();
    const findByIdMock: jest.Mock = jest.fn();
    const findByIdAndDeleteMock: jest.Mock = jest.fn();
    const saveMock: jest.Mock = jest.fn();

    class ModelMock {
        public static find: jest.Mock = findMock;
        public static findById: jest.Mock = findByIdMock;
        public static findByIdAndDelete: jest.Mock = findByIdAndDeleteMock;
        public save: jest.Mock = saveMock; // REVIEW why this not static
    }
    (<jest.Mock>model).mockReturnValue(ModelMock);

    const testDb: MongoDB<TestEntity> = new MongoDB('test', new Schema());

    test("findById method is called with a valid id and returns an Entity", async () => {
        const
            valid_id: string = dummyId(),
            doc: Object = { ...dummyDocument(valid_id) },
            expectedEntity: TestEntity = { ...dummyTestEntity(valid_id) };

        findByIdMock.mockResolvedValueOnce(doc);

        expect(await testDb.findById(valid_id)).toStrictEqual(expectedEntity);
        expect(findByIdMock).toBeCalledTimes(1);
    });

    test("findById method is called with an invalid id and returns null", async () => {
        const invalid_id: string = 'not_a_bson_objectid';

        expect(await testDb.findById(invalid_id)).toStrictEqual(null);
    });

    test("findById method is called with a valid id but no Document is found, returns null", async () => {
        const valid_id: string = dummyId();

        findByIdMock.mockResolvedValueOnce(null);

        expect(await testDb.findById(valid_id)).toStrictEqual(null);
        expect(findByIdMock).toBeCalledTimes(1);
    });

    test("find method is called with no params and returns an array with all found Entities", async () => {
        const
            doc1 = { ...dummyDocument('id1', 'test1', 21) },
            doc2 = { ...dummyDocument('id2', 'test2', 22) },
            doc3 = { ...dummyDocument('id3', 'test3', 23) },
            ent1 = { ...dummyTestEntity('id1', 'test1', 21) },
            ent2 = { ...dummyTestEntity('id2', 'test2', 22) },
            ent3 = { ...dummyTestEntity('id3', 'test3', 23) };

        findMock.mockResolvedValueOnce([doc1, doc2, doc3]);

        expect(await testDb.find()).toStrictEqual([ent1, ent2, ent3]);
        expect(findMock).toBeCalledTimes(1);
    });

    test("find method is called with no params, finds no Entities and returns an empty array", async () => {
        findMock.mockResolvedValueOnce([]);

        expect(await testDb.find()).toStrictEqual([]);
        expect(findMock).toBeCalledTimes(1);
    });

    test("find method is called with params, finds no Entities and returns an empty array", async () => {
        const params: TestEntity = dummyTestEntity();

        findMock.mockResolvedValueOnce([]);

        expect(await testDb.find(params)).toStrictEqual([]);
        expect(findMock).toBeCalledTimes(1);
    });

    test("create method is called with an Entity without id and returns the created Entity with id", async () => {
        const id = dummyId();

        const partialEntity: TestEntity = omitProps(dummyTestEntity(), ['id']);

        const doc: Object = {
            ...dummyDocument(id),
        }
        saveMock.mockResolvedValueOnce(doc);

        const expectedEntity: TestEntity = {
            ...dummyTestEntity(),
            id: id
        };
        expect(await testDb.create(partialEntity)).toStrictEqual(expectedEntity);
        expect(saveMock).toBeCalledTimes(1);
    });

    test("delete method is called with a valid id, deletes the document and returns true", async () => {
        const valid_id = dummyId();

        findByIdAndDeleteMock.mockResolvedValueOnce(true);

        expect(await testDb.delete(valid_id)).toStrictEqual(true);
        expect(findByIdAndDeleteMock).toBeCalledTimes(1);
    });

    test("delete method is called with a valid id, doesn't find the document and returns false", async () => {
        const valid_id = dummyId();

        findByIdAndDeleteMock.mockResolvedValueOnce(false);

        expect(await testDb.delete(valid_id)).toStrictEqual(false);
        expect(findByIdAndDeleteMock).toBeCalledTimes(1);
    });

    test("delete method is called with an invalid id and returns null", async () => {
        const invalid_id = 'invalid_id';

        expect(await testDb.delete(invalid_id)).toStrictEqual(null);
    });

});
