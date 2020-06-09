import { dummyId, omitProps } from "utils/Functions";
import { UserHandler } from "services/handlers/UserHandler";
import { dummyUserModel, UserModel } from "services/models/UserModel";
import { dummyUserEntity, UserEntity } from "persistence/entities/UserEntity";

jest.mock('persistence/Repository');
jest.mock('persistence/mongodb/MongoDB');

describe('UserHandler - utility methods', () => {
    beforeEach(() => {
        expect.hasAssertions();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const handler = new UserHandler();

    test("method toUserEntity is called with a full UserModel and returns a full UserEntity", () => {
        const id = dummyId();

        const inputtedUserModel = new UserModel({
            ...dummyUserModel(),
            id: id
        })

        const expectedUserEntity = new UserEntity({
            ...dummyUserEntity(),
            id: id
        })

        expect(handler.toUserEntity(inputtedUserModel)).toStrictEqual(expectedUserEntity);
    });

    test("method toUserEntity is called with a partial UserModel and returns a full UserEntity with omitted properties as undefined", () => {
        const id = dummyId();

        const inputtedUserModel = new UserModel({
            ...omitProps(dummyUserModel(), ['lastName']),
            id: id
        })

        const expectedUserEntity = new UserEntity({
            ...dummyUserEntity(),
            lastName: undefined,
            id: id
        })

        expect(handler.toUserEntity(inputtedUserModel)).toStrictEqual(expectedUserEntity);
    });

    test("method toUserModel is called with a full UserEntity and returns a full UserModel with a null password field", async () => {
        const id = dummyId();

        const inputtedUserEntity = new UserEntity({
            ...dummyUserEntity(),
            id: id
        })

        const expectedUserModel = new UserModel({
            ...dummyUserModel(),
            password: null,
            id: id
        })

        expect(await handler.toUserModel(inputtedUserEntity)).toStrictEqual(expectedUserModel);
    });

    test("method toUserModel is called with a partial UserEntity and returns a full UserModel with a null password field and omitted properties as undefined", async () => {
        const id = dummyId();

        const inputtedUserEntity = new UserEntity({
            ...omitProps(dummyUserEntity(), ['lastName']),
            id: id
        })

        const expectedUserModel = new UserModel({
            ...dummyUserModel(),
            lastName: undefined,
            password: null,
            id: id
        })

        expect(await handler.toUserModel(inputtedUserEntity)).toStrictEqual(expectedUserModel);
    });

});
