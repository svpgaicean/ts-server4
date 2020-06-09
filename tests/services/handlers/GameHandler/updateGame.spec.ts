import { omitProps, dummyId, pickProps } from "utils/Functions";
import { Repository } from "persistence/Repository";
import { UserEntity } from "persistence/entities/UserEntity";
import { GameHandler } from "services/handlers/GameHandler";
import { GameModel, dummyGameModel } from "services/models/GameModel";
import { FullGame, PartialUpdateGame } from "types/GameTypes";
import { GameEntity, dummyGameEntity } from "persistence/entities/GameEntity";
import { Validation } from "utils/Validation";
import { CustomError, NodeEnv } from "utils/ErrorHandler";

jest.mock('persistence/Repository');
jest.mock('persistence/mongodb/MongoDB');

describe('GameHandler - updateGame method', () => {
    beforeEach(() => {
        expect.hasAssertions();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const updateMock: jest.Mock = jest.fn();
    (<jest.Mock>Repository)
        .mockImplementation(function (this: Repository<GameEntity>)
            : Repository<GameEntity> {

            this.update = updateMock;
            return this;
        });

    const handler = new GameHandler();
    // const gameExists = jest.spyOn(handler, 'gameExists');
    const gameIdExists = jest.spyOn(handler, 'gameIdExists');
    const gameDetailsExist = jest.spyOn(handler, 'gameDetailsExist');

    test("is called with a valid PARTIAL model and returns the updated FullGame", async () => {
        const
            id: string = dummyId(),
            dummy: GameModel = dummyGameModel();

        const validModel: PartialUpdateGame = {
            ...pickProps(dummy, ['publisher']),
            publisher: 'updated'
        }
        // assert that provided id exists in database
        gameIdExists.mockResolvedValueOnce(true);

        const updatedEntity: GameEntity = {
            ...dummyGameEntity(),
            publisher: validModel.publisher,
            id: id
        }
        updateMock.mockReturnValueOnce(updatedEntity);

        const expectedUser: FullGame = {
            ...dummy,
            publisher: validModel.publisher,
            id: id
        }
        expect(await handler.updateGame(id, validModel, Validation.PARTIAL))
            .toEqual(expectedUser)
        expect(gameIdExists).toBeCalledTimes(1);
        expect(updateMock).toBeCalledTimes(1);
    });

    test("is called with a valid FULL model and returns the updated FullGame", async () => {
        const
            id: string = dummyId(),
            dummy: GameModel = dummyGameModel();

        const validModel: PartialUpdateGame = {
            ...omitProps(dummy, ['id']),
            title: 'updated_title',
            year: 2020,
            developer: 'updated_developer'
        }

        // assert that provided id exists in database
        gameIdExists.mockResolvedValueOnce(true);
        // assert that provided unique fields intersection doesn't already exist in database
        gameDetailsExist.mockResolvedValueOnce(false);

        const updatedEntity: GameEntity = {
            ...dummyGameEntity(),
            title: validModel.title,
            year: validModel.year,
            developer: validModel.developer,
            id: id
        }
        updateMock.mockReturnValueOnce(updatedEntity);

        const expectedUser: FullGame = {
            ...dummy,
            title: validModel.title,
            year: validModel.year,
            developer: validModel.developer,
            id: id
        }
        expect(await handler.updateGame(id, validModel, Validation.PARTIAL))
            .toEqual(expectedUser)
        expect(gameIdExists).toBeCalledTimes(1);
        expect(gameDetailsExist).toBeCalledTimes(1);
        expect(updateMock).toBeCalledTimes(1);
    });

    test("is called with an invalid model and throws 'Invalid Model' error", async () => {
        const invalidModel: GameModel = {
            ...dummyGameModel(),
            title: 'a_much_too_long_title_aaaaaaaa',
            year: 1200 // invalid year
        };

        await expect(handler.updateGame('valid_id', invalidModel, Validation.PARTIAL))
            .rejects.toThrow(new CustomError(400, 'Invalid Model'));
    });

    test("is called with an invalid game id and throws 'Game Not Found' error", async () => {
        const validModel: PartialUpdateGame = omitProps(dummyGameModel(), ['id']);

        // assert that provided id doesn't exist in database
        gameIdExists.mockResolvedValueOnce(false);

        await expect(handler.updateGame('invalid_id', validModel, Validation.PARTIAL))
            .rejects.toThrow(new CustomError(404, 'Game Not Found'));

        expect(gameIdExists).toBeCalledTimes(1);
    });

    test("is called with an existing game's unique fields and throws 'Game Already Exists' error", async () => {
        const validModel: PartialUpdateGame = {
            ...omitProps(dummyGameModel(), ['id']),
            title: 'existing_title',
            year: 2020,
            developer: 'existing_developer'
        }

        // assert that provided id exists in database
        gameIdExists.mockResolvedValueOnce(true);
        // assert that provided unique fields intersection already exists in database
        gameDetailsExist.mockResolvedValueOnce(true);

        await expect(handler.updateGame('valid_id', validModel, Validation.PARTIAL))
            .rejects.toThrow(new CustomError(400, 'Game Already Exists'));

        expect(gameIdExists).toBeCalledTimes(1);
        expect(gameDetailsExist).toBeCalledTimes(1);
    });

    test("is called with some of an existing game's unique fields and returns the updated FullGame", async () => {
        const
            id: string = dummyId(),
            dummy: GameModel = dummyGameModel();

        const validModel: PartialUpdateGame = {
            ...omitProps(dummyGameModel(), ['id']),
            title: 'existing_title',
            year: 2020,
            developer: 'new_developer'
        }

        // assert that provided id exists in database
        gameIdExists.mockResolvedValueOnce(true);
        // assert that provided unique fields intersection don't already exists in database
        gameDetailsExist.mockResolvedValueOnce(false);

        const updatedEntity: GameEntity = {
            ...dummyGameEntity(),
            title: validModel.title,
            year: validModel.year,
            developer: validModel.developer,
            id: id
        }
        updateMock.mockReturnValueOnce(updatedEntity);

        const expectedUser: FullGame = {
            ...dummy,
            title: validModel.title,
            year: validModel.year,
            developer: validModel.developer,
            id: id
        }
        expect(await handler.updateGame(id, validModel, Validation.PARTIAL))
            .toEqual(expectedUser)
        expect(gameIdExists).toBeCalledTimes(1);
        expect(gameDetailsExist).toBeCalledTimes(1);
        expect(updateMock).toBeCalledTimes(1);
    });

});
