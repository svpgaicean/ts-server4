import { omitProps, dummyId } from "utils/Functions";
import { Repository } from "persistence/Repository";
import { GameHandler } from "services/handlers/GameHandler";
import { GameModel, dummyGameModel } from "services/models/GameModel";
import { RegisterGame, FullGame } from "types/GameTypes";
import { GameEntity, dummyGameEntity } from "persistence/entities/GameEntity";
import { CustomError } from "utils/ErrorHandler";

jest.mock('persistence/Repository');
jest.mock('persistence/mongodb/MongoDB');

describe('GameHandler - createGame method', () => {
    beforeEach(() => {
        expect.hasAssertions();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const createMock: jest.Mock = jest.fn();
    (<jest.Mock>Repository)
        .mockImplementation(function (this: Repository<GameEntity>)
            : Repository<GameEntity> {

            this.create = createMock;
            return this;
        });

    const handler = new GameHandler();
    // const gameExists = jest.spyOn(handler, 'gameExists');
    const gameIdExists = jest.spyOn(handler, 'gameIdExists');
    const gameDetailsExist = jest.spyOn(handler, 'gameDetailsExist');

    test("is called with a valid model and returns a FullGame", async () => {
        const
            id: string = dummyId(),
            dummyModel: GameModel = dummyGameModel();

        const validModel: RegisterGame = {
            ...omitProps(dummyModel, ['id']),
            title: "new_title",
            year: 2017,
            developer: "new_developer"
        }
        // assert that provided unique fields intersection doesn't already exist in database
        gameDetailsExist.mockResolvedValueOnce(false);

        const dummyEntity: GameEntity = {
            ...dummyGameEntity(),
            id: id,
            title: validModel.title,
            year: validModel.year,
            developer: validModel.developer
        }
        createMock.mockReturnValueOnce(dummyEntity);

        const expectedGame: FullGame = {
            ...dummyModel,
            id: id,
            title: validModel.title,
            year: validModel.year,
            developer: validModel.developer
        }
        expect(await handler.createGame(validModel)).toStrictEqual(expectedGame);
        expect(gameDetailsExist).toBeCalledTimes(1);
        expect(createMock).toBeCalledTimes(1);
    });

    test("is called with an invalid model and throws 'Invalid Model' error", async () => {
        const invalidModel: GameModel = {
            ...dummyGameModel(),
            year: 1200, // invalid year
            title: 'prettttttttyyyy_looooooong_tiiiiiitle'
        }

        await expect(handler.createGame(invalidModel)).rejects
            .toThrow(new CustomError(400, 'Invalid Model'));
    });

    test("is called with an existing game's unique fields and throws 'Game Already Exists' error", async () => {
        const validModel: RegisterGame = {
            ...omitProps(dummyGameModel(), ['id']),
            title: 'existing_title',
            year: 2017,
            developer: 'existing_developer'
        }
        // assert that provided unique fields intersection already exists in database
        gameDetailsExist.mockResolvedValueOnce(true);

        await expect(handler.createGame(validModel)).rejects
            .toThrow(new CustomError(400, 'Game Already Exists'));

        expect(gameDetailsExist).toBeCalledTimes(1);
    });

    test("is called with SOME of an existing game's unique fields and returns a FullGame", async () => {
        const
            id: string = dummyId(),
            dummyModel: GameModel = dummyGameModel();

        const validModel: RegisterGame = {
            ...omitProps(dummyModel, ['id']),
            title: "existing_title",
            year: 2020,
            developer: "new_developer"
        }
        // assert that provided unique fields intersection doesn't already exist in database
        gameDetailsExist.mockResolvedValueOnce(false);

        const dummyEntity: GameEntity = {
            ...dummyGameEntity(),
            id: id,
            title: validModel.title,
            year: validModel.year,
            developer: validModel.developer
        }
        createMock.mockReturnValueOnce(dummyEntity);

        const expectedGame: FullGame = {
            ...dummyModel,
            id: id,
            title: validModel.title,
            year: validModel.year,
            developer: validModel.developer
        }
        expect(await handler.createGame(validModel)).toStrictEqual(expectedGame);
        expect(gameDetailsExist).toBeCalledTimes(1);
        expect(createMock).toBeCalledTimes(1);
    });

});
