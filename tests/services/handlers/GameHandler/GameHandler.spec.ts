import { dummyId, pickProps } from "utils/Functions";
import { Repository } from "persistence/Repository";
import { GameHandler } from "services/handlers/GameHandler";
import { dummyGameModel } from "services/models/GameModel";
import { FullGame, BasicGame } from "types/GameTypes";
import { GameEntity, dummyGameEntity } from "persistence/entities/GameEntity";
import { GameEcho } from "utils/Enums";
import { CustomError } from "utils/ErrorHandler";

jest.mock('persistence/Repository');
jest.mock('persistence/mongodb/MongoDB');

describe('GameHandler', () => {
    beforeEach(() => {
        expect.hasAssertions();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const findByIdMock: jest.Mock = jest.fn();
    const findMock: jest.Mock = jest.fn();
    (<jest.Mock>Repository)
        .mockImplementation(function (this: Repository<GameEntity>)
            : Repository<GameEntity> {

            this.findById = findByIdMock;
            this.find = findMock;
            return this;
        });

    const handler = new GameHandler();
    const gameIdExists = jest.spyOn(handler, 'gameIdExists');

    test("method getGame is called with a valid id and default details and returns a BasicGame", async () => {
        const id: string = dummyId();

        const dummyEntity: GameEntity = {
            ...dummyGameEntity(),
            id: id
        }
        findByIdMock.mockReturnValueOnce(dummyEntity);

        const expectedGame: BasicGame = {
            ...pickProps(dummyGameModel(), ['id', 'title', 'year', 'developer']),
            id: id,
        }
        expect(await handler.getGame(id, GameEcho.BASIC)).toStrictEqual(expectedGame);
        expect(findByIdMock).toBeCalledTimes(1);
    });

    test("method getGame is called with a valid id and details=FULL and returns a FullGame", async () => {
        const id: string = dummyId();

        const dummyEntity: GameEntity = {
            ...dummyGameEntity(),
            id: id
        }
        findByIdMock.mockReturnValue(dummyEntity);

        const expectedGame: FullGame = {
            ...dummyGameModel(),
            id: id,
        }
        expect(await handler.getGame(id, GameEcho.FULL)).toStrictEqual(expectedGame);
        expect(findByIdMock).toBeCalledTimes(1);
    });

    test("method getGame is called with an invalid id and throws 'Game Not Found' error", async () => {
        findByIdMock.mockReturnValueOnce(null);

        await expect(handler.getGame('invalid_id', GameEcho.BASIC)).rejects
            .toThrow(new CustomError(404, 'Game Not Found'));

        expect(findByIdMock).toBeCalledTimes(1);
    });

    test("method getAllGames is called with default details and returns an array of BasicGame", async () => {
        const
            id1: string = dummyId(),
            id2: string = dummyId();

        const
            dummyEntity1: GameEntity = {
                ...dummyGameEntity(),
                id: id1
            },
            dummyEntity2: GameEntity = {
                ...dummyGameEntity(),
                id: id2
            }
        findMock.mockReturnValueOnce([dummyEntity1, dummyEntity2]);

        const
            expectedGame1: BasicGame = {
                ...pickProps(dummyGameModel(), ['id', 'title', 'year', 'developer']),
                id: id1,
            },
            expectedGame2: BasicGame = {
                ...pickProps(dummyGameModel(), ['id', 'title', 'year', 'developer']),
                id: id2,
            }
        expect(await handler.getAllGames(GameEcho.BASIC)).toStrictEqual([expectedGame1, expectedGame2]);
        expect(findMock).toBeCalledTimes(1);
    });

    test("method getAllGames is called with default details=FULL and returns an array of FullGame", async () => {
        const
            id1: string = dummyId(),
            id2: string = dummyId();

        const
            dummyEntity1: GameEntity = {
                ...dummyGameEntity(),
                id: id1
            },
            dummyEntity2: GameEntity = {
                ...dummyGameEntity(),
                id: id2
            }
        findMock.mockReturnValueOnce([dummyEntity1, dummyEntity2]);

        const
            expectedGame1: FullGame = {
                ...dummyGameModel(),
                id: id1,
            },
            expectedGame2: FullGame = {
                ...dummyGameModel(),
                id: id2,
            }
        expect(await handler.getAllGames(GameEcho.FULL)).toStrictEqual([expectedGame1, expectedGame2]);
        expect(findMock).toBeCalledTimes(1);
    });

    test("method getAllGames is called but no Games exist, returns empty array", async () => {
        findMock.mockReturnValueOnce([]);

        expect(await handler.getAllGames(GameEcho.BASIC)).toEqual([]);
        expect(findMock).toBeCalledTimes(1);
    });

    test("method deleteGame is called with a valid id and doesn't throw any errors", async () => {
        // assert that game with provided id exists in database
        gameIdExists.mockResolvedValueOnce(true);

        await expect(handler.deleteGame('valid_id')).resolves
            .not.toThrow();

        expect(gameIdExists).toBeCalledTimes(1);
    });

    test("method deleteGame is called with an invalid id and throws 'Game Not Found' error", async () => {
        // assert that game with provided id doesn't exist in database
        gameIdExists.mockResolvedValueOnce(false);

        await expect(handler.deleteGame('invalid_id')).rejects
            .toThrow(new CustomError(404, 'Game Not Found'));

        expect(gameIdExists).toBeCalledTimes(1);
    });

});
