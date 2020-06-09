import { UserController } from 'services/controllers/UserController';
import { dummyUserModel } from 'services/models/UserModel';
import { omitProps, pickProps } from 'utils/Functions';
import { RegisterUser, FullUpdateUser, PartialUpdateUser } from 'types/UserTypes';
import { UserEcho } from 'utils/Enums';
import { CustomError } from 'utils/ErrorHandler';

jest.mock('services/handlers/UserHandler');

describe('UserController', () => {
    beforeEach(() => {
        expect.hasAssertions();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const controller = new UserController();
    const deleteUser = jest.spyOn(controller.handler, 'deleteUser');

    test("method register is called with a valid body and doesn't throw any errors", async () => {
        const validBody: RegisterUser = omitProps(dummyUserModel(), ['id', 'wishlist']);

        await expect(controller.register(validBody)).resolves
            .not.toThrow();
    });

    test("method register is called with an invalid body and throws 'Invalid Body' error", async () => {
        const invalidBody = { prop: 'garbage' };

        await expect(controller.register(<any>invalidBody)).rejects
            .toThrowError(new CustomError(400, 'Invalid Body'));
    });

    test("method getAll is called and doesn't throw any errors", async () => {
        await expect(controller.getAll()).resolves
            .not.toThrow();
    });

    test("method getOne is called with a valid query param and doesn't throw any errors", async () => {
        const queryParam = UserEcho.DETAILS;

        await expect(controller.getOne('dummy_id', queryParam)).resolves
            .not.toThrow();
    });

    test("method getOne is called with an invalid query param and throws 'Invalid Query Param' error", async () => {
        const queryParam = 'garbage_string';

        await expect(controller.getOne('dummy_id', queryParam)).rejects
            .toThrowError(new CustomError(400, 'Invalid Query Param'));
    });

    test("method fullUpdate is called with a valid body and doesn't throw any errors", async () => {
        const validBody: FullUpdateUser = omitProps(dummyUserModel(), ['id', 'password']);

        await expect(controller.fullUpdate('dummy_id', validBody)).resolves
            .not.toThrow();
    });

    test("method fullUpdate is called with an invalid body and throws 'Invalid Body' error", async () => {
        const invalidBody = { prop: 'garbage' };

        await expect(controller.fullUpdate('dummy_id', <any>invalidBody)).rejects
            .toThrowError(new CustomError(400, 'Invalid Body'));
    });

    test("method partialUpdate is called with a valid body and doesn't throw any errors", async () => {
        const validBody: PartialUpdateUser = pickProps(dummyUserModel(), ['firstName', 'lastName']);

        await expect(controller.partialUpdate('dummy_id', validBody)).resolves
            .not.toThrow();
    });

    test("method partialUpdate is called with an invalid body and throws 'Invalid Body' error", async () => {
        const invalidBody = { prop: 'garbage' };

        await expect(controller.partialUpdate('dummy_id', <any>invalidBody)).rejects
            .toThrowError(new CustomError(400, 'Invalid Body'));
    });

    test("method remove is called and doesn't throw any errors", async () => {
        deleteUser.mockResolvedValueOnce(true);

        await expect(controller.remove('dummy_id')).resolves
            .not.toThrow();
        
        expect(deleteUser).toBeCalledTimes(1);
    });

});
