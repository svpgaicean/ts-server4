import { UserHandler } from "services/handlers/UserHandler";
import { User, PartialUpdateUser, FullUpdateUser } from "types/UserTypes";
import { omitProps, dummyId, pickProps } from "utils/Functions";
import { dummyUserModel, UserModel } from "services/models/UserModel";
import { Repository } from "persistence/Repository";
import { UserEntity, dummyUserEntity } from "persistence/entities/UserEntity";
import { Validation } from "utils/Validation";
import { CustomError } from "utils/ErrorHandler";

jest.mock('persistence/Repository');
jest.mock('persistence/mongodb/MongoDB');

describe('UserHandler - updateUser method', () => {
    beforeEach(() => {
        expect.hasAssertions();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const updateMock: jest.Mock = jest.fn();
    (<jest.Mock>Repository)
        .mockImplementation(function (this: Repository<UserEntity>)
            : Repository<UserEntity> {

            this.update = updateMock;
            return this;
        });

    const handler = new UserHandler();
    const userIdExists = jest.spyOn(handler, 'userIdExists');
    const userEmailExists = jest.spyOn(handler, 'userEmailExists');

    test("is called with a valid PARTIAL model and returns the updated User", async () => {
        const
            id: string = dummyId(),
            dummy: UserModel = dummyUserModel();

        const validModel: PartialUpdateUser = {
            ...pickProps(dummy, ['firstName']),
            firstName: 'updated'
        }
        // assert that provided id exists in database
        userIdExists.mockResolvedValueOnce(true);

        const updatedEntity: UserEntity = {
            ...dummyUserEntity(),
            firstName: validModel.firstName,
            id: id
        }
        updateMock.mockReturnValueOnce(updatedEntity);

        const expectedUser: User = {
            ...omitProps(dummy, ['password']),
            firstName: validModel.firstName,
            id: id
        }
        expect(await handler.updateUser(id, validModel, Validation.PARTIAL))
            .toStrictEqual(expectedUser)
        expect(userIdExists).toBeCalledTimes(1);
        expect(updateMock).toBeCalledTimes(1);
    });

    test("is called with a valid FULL model and returns the updated User", async () => {
        const
            id: string = dummyId(),
            dummy: UserModel = dummyUserModel();

        const validModel: FullUpdateUser = {
            ...omitProps(dummy, ['id', 'password']),
            email: 'updated_email@gmail.com'
        }
        // assert that provided id exists in database
        userIdExists.mockResolvedValueOnce(true);
        // assert that provided email doesn't already exist in database
        userEmailExists.mockResolvedValueOnce(false);

        const updatedEntity: UserEntity = {
            ...dummyUserEntity(),
            email: validModel.email,
            id: id
        }
        updateMock.mockReturnValueOnce(updatedEntity);

        const expectedUser: User = {
            ...omitProps(dummy, ['password']),
            email: validModel.email,
            id: id
        }
        expect(await handler.updateUser(id, validModel, Validation.FULL))
            .toStrictEqual(expectedUser)
        expect(userIdExists).toBeCalledTimes(1);
        expect(userEmailExists).toBeCalledTimes(1);
        expect(updateMock).toBeCalledTimes(1);
    });

    test("is called with an invalid model and throws 'Invalid Model' error", async () => {
        const invalidModel: UserModel = {
            ...dummyUserModel(),
            email: 'bad_email_format',
            password: 'bad_password_format'
        };

        await expect(handler.updateUser('valid_id', invalidModel, Validation.PARTIAL))
            .rejects.toThrow(new CustomError(400, 'Invalid Model'));
    });

    test("is called with an invalid user id and throws 'User Not Found' error", async () => {
        const validModel: PartialUpdateUser = omitProps(dummyUserModel(), ['id', 'password']);

        // assert that provided id doesn't exist in database
        userIdExists.mockResolvedValueOnce(false);

        await expect(handler.updateUser('invalid_id', validModel, Validation.PARTIAL))
            .rejects.toThrow(new CustomError(404, 'User Not Found'));

        expect(userIdExists).toBeCalledTimes(1);
    });

    test("is called with an existing user's unique fields and throws 'User Already Exists' error", async () => {
        const validModel: PartialUpdateUser = {
            ...omitProps(dummyUserModel(), ['id', 'password']),
            email: 'existing_email@gmail.com'
        }

        // assert that provided id exists in database
        userIdExists.mockResolvedValueOnce(true);
        // assert that provided email already exists in database
        userEmailExists.mockResolvedValueOnce(true);

        await expect(handler.updateUser('valid_id', validModel, Validation.PARTIAL))
            .rejects.toThrow(new CustomError(400, 'User Already Exists'));

        expect(userIdExists).toBeCalledTimes(1);
        expect(userEmailExists).toBeCalledTimes(1);
    });

});
