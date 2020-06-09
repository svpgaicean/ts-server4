import { UserHandler } from "services/handlers/UserHandler";
import { RegisterUser, User } from "types/UserTypes";
import { omitProps, dummyId } from "utils/Functions";
import { dummyUserModel, UserModel } from "services/models/UserModel";
import { Repository } from "persistence/Repository";
import { UserEntity, dummyUserEntity } from "persistence/entities/UserEntity";
import { UserEcho } from "utils/Enums";
import { CustomError } from "utils/ErrorHandler";

jest.mock('persistence/Repository');
jest.mock('persistence/mongodb/MongoDB');

describe('UserHandler', () => {
    beforeEach(() => {
        expect.hasAssertions();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const createMock: jest.Mock = jest.fn();
    const findByIdMock: jest.Mock = jest.fn();
    const findMock: jest.Mock = jest.fn();
    const deleteMock: jest.Mock = jest.fn();
    (<jest.Mock>Repository)
        .mockImplementation(function (this: Repository<UserEntity>)
            : Repository<UserEntity> {

            this.create = createMock;
            this.findById = findByIdMock;
            this.find = findMock;
            this.delete = deleteMock;
            return this;
        });

    const handler = new UserHandler();
    const userIdExists = jest.spyOn(handler, 'userIdExists');
    const userEmailExists = jest.spyOn(handler, 'userEmailExists');

    test("method createUser is called with a valid model and returns a User", async () => {
        const
            id: string = dummyId(),
            dummyModel: UserModel = dummyUserModel();

        const validModel: RegisterUser = {
            ...omitProps(dummyModel, ['id', 'wishlist']),
            email: 'new_email@gmail.com'
        }
        // assert that provided email doesn't already exist in database
        userEmailExists.mockResolvedValueOnce(false);

        const dummyEntity: UserEntity = {
            ...dummyUserEntity(),
            id: id,
            email: validModel.email
        }
        createMock.mockReturnValueOnce(dummyEntity);

        const expectedUser: User = {
            ...omitProps(dummyModel, ['password']),
            id: id,
            email: validModel.email
        }
        expect(await handler.createUser(validModel)).toStrictEqual(expectedUser);
        expect(userEmailExists).toBeCalledTimes(1);
        expect(createMock).toBeCalledTimes(1);
    });

    test(`method createUser is called with an invalid model and throws
        'Invalid Model' error`, async () => {

        const invalidModel: UserModel = {
            ...dummyUserModel(),
            email: 'bad_email_format',
            password: 'bad_password_format'
        }

        await expect(handler.createUser(invalidModel)).rejects
            .toThrow(new CustomError(400, 'Invalid Model'));
    });

    test(`method createUser is called with an existing user's unique fields and
        throws 'User Already Exists' error`, async () => {

        const validModel: RegisterUser = {
            ...omitProps(dummyUserModel(), ['id', 'wishlist']),
            email: 'existing_email@gmail.com'
        }

        // assert that provided email already exists in database
        userEmailExists.mockResolvedValueOnce(true);

        await expect(handler.createUser(validModel)).rejects
            .toThrow(new CustomError(400, 'User Already Exists'));

        expect(userEmailExists).toBeCalledTimes(1);
    });

    test("method getUser is called with a valid id and returns a User", async () => {
        const id: string = dummyId();

        const dummyEntity: UserEntity = {
            ...dummyUserEntity(),
            id: id
        }
        findByIdMock.mockReturnValueOnce(dummyEntity);

        const expectedUser: User = {
            ...omitProps(dummyUserModel(), ['password']),
            id: id,
        }

        expect(await handler.getUser(id, UserEcho.ID)).toStrictEqual(expectedUser);
        expect(findByIdMock).toBeCalledTimes(1);
    });

    test("method getUser is called with an invalid id and throws 'User Not Found' error", async () => {
        findByIdMock.mockReturnValueOnce(null);

        await expect(handler.getUser('invalid_id', UserEcho.ID)).rejects
            .toThrow(new CustomError(404, 'User Not Found'));

        expect(findByIdMock).toBeCalledTimes(1);
    });

    test("method getAllUsers is called and returns a User", async () => {
        const
            id1: string = dummyId(),
            id2: string = dummyId();

        const
            dummyEntity1: UserEntity = {
                ...dummyUserEntity(),
                id: id1
            },
            dummyEntity2: UserEntity = {
                ...dummyUserEntity(),
                id: id2
            }
        findMock.mockReturnValueOnce([dummyEntity1, dummyEntity2]);

        const
            expectedUser1: User = {
                ...omitProps(dummyUserModel(), ['password']),
                id: id1
            },
            expectedUser2: User = {
                ...omitProps(dummyUserModel(), ['password']),
                id: id2
            }
        expect(await handler.getAllUsers()).toStrictEqual([expectedUser1, expectedUser2]);
        expect(findMock).toBeCalledTimes(1);
    });

    test("method getAllUsers is called but no Users exist, returns empty array", async () => {
        findMock.mockReturnValueOnce([]);

        expect(await handler.getAllUsers()).toEqual([]);
        expect(findMock).toBeCalledTimes(1);
    });

    test("method deleteUser is called with a valid id and doesn't throw any errors", async () => {
        // assert that user with provided id exists in database
        userIdExists.mockResolvedValueOnce(true);

        await expect(handler.deleteUser('valid_id')).resolves
            .not.toThrow();

        expect(userIdExists).toBeCalledTimes(1);
    });

    test("method deleteUser is called with an invalid id and throws 'User Not Found' error", async () => {
        // assert that user with provided id doesn't exist in database
        userIdExists.mockResolvedValueOnce(false);

        await expect(handler.deleteUser('invalid_id')).rejects
            .toThrow(new CustomError(404, 'User Not Found'));

        expect(userIdExists).toBeCalledTimes(1);
    });

});
