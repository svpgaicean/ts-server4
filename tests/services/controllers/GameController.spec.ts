import { GameController } from 'services/controllers/GameController';
import { omitProps, pickProps } from 'utils/Functions';
import { GameEcho } from 'utils/Enums';
import { RegisterGame, FullUpdateGame, PartialUpdateGame } from 'types/GameTypes';
import { dummyGameModel } from 'services/models/GameModel';
import { CustomError } from 'utils/ErrorHandler';

jest.mock('services/handlers/GameHandler');

describe('GameController', () => {
    beforeEach(() => {
        expect.hasAssertions();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const controller = new GameController();
    const deleteGame = jest.spyOn(controller.handler, 'deleteGame');

    test("method register is called with a valid body and doesn't throw any errors", async () => {
        const validBody: RegisterGame = omitProps(dummyGameModel(), ['id']);

        await expect(controller.register(validBody)).resolves
            .not.toThrow();
    });

    test("method register is called with an invalid body and throws 'Invalid Body' error", async () => {
        const invalidBody = { prop: 'garbage' };

        await expect(controller.register(<any>invalidBody)).rejects
            .toThrowError(new CustomError(400, 'Invalid Body'));
    });

    test("method getAll is called with a valid query param and doesn't throw any errors", async () => {
        const queryParam = GameEcho.FULL;

        await expect(controller.getAll(queryParam)).resolves
            .not.toThrow();
    });

    test("method getAll is called with an invalid query param and throws 'Invalid Query Param' error", async () => {
        const queryParam = 'garbage_string';

        await expect(controller.getAll(queryParam)).rejects
            .toThrowError(new CustomError(400, 'Invalid Query Param'));
    });

    test("method getOne is called with a valid query param and doesn't throw any errors", async () => {
        const queryParam = GameEcho.FULL;

        await expect(controller.getOne('dummy_id', queryParam)).resolves
            .not.toThrow();
    });

    test("method getOne is called with an invalid query param and throws 'Invalid Query Param' error", async () => {
        const queryParam = 'garbage_string';

        await expect(controller.getOne('dummy_id', queryParam)).rejects
            .toThrowError(new CustomError(400, 'Invalid Query Param'));
    });

    test("method fullUpdate is called with a valid body and doesn't throw any errors", async () => {
        const validBody: FullUpdateGame = omitProps(dummyGameModel(), ['id']);

        await expect(controller.fullUpdate('dummy_id', validBody)).resolves
            .not.toThrow();
    });

    test("method fullUpdate is called with an invalid body and throws 'Invalid Body' error", async () => {
        const invalidBody = { prop: 'garbage' };

        await expect(controller.fullUpdate('dummy_id', <any>invalidBody)).rejects
            .toThrowError(new CustomError(400, 'Invalid Body'));
    });

    test("method partialUpdate is called with a valid body and doesn't throw any errors", async () => {
        const validBody: PartialUpdateGame = pickProps(dummyGameModel(), ['publisher', 'genre']);

        await expect(controller.partialUpdate('dummy_id', validBody)).resolves
            .not.toThrow();
    });

    test("method partialUpdate is called with an invalid body and throws 'Invalid Body' error", async () => {
        const invalidBody = { prop: 'garbage' };

        await expect(controller.partialUpdate('dummy_id', <any>invalidBody)).rejects
            .toThrowError(new CustomError(400, 'Invalid Body'));
    });

    test("method remove is called and doesn't throw any errors", async () => {
        deleteGame.mockResolvedValueOnce(true);

        await expect(controller.remove('dummy_id')).resolves
            .not.toThrow();

        expect(deleteGame).toHaveBeenCalledTimes(1);
    });

});
