import { GameHandler } from "services/handlers/GameHandler";
import { dummyGameModel, GameModel } from "services/models/GameModel";
import { dummyGameEntity, GameEntity } from "persistence/entities/GameEntity";
import { dummyId, omitProps, pickProps } from "utils/Functions";
import { Repository } from "persistence/Repository";
import { BasicGame, FullGame } from "types/GameTypes";

jest.mock('persistence/Repository');
jest.mock('persistence/mongodb/MongoDB');

describe('GameHandler - utility methods', () => {
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

    test("method toGameEntity is called with a full GameModel and returns a full GameEntity", () => {
        const id = dummyId();

        const inputtedGameModel = new GameModel({
            ...dummyGameModel(),
            id: id
        });

        const expectedGameEntity = new GameEntity({
            ...dummyGameEntity(),
            id: id
        });

        expect(handler.toGameEntity(inputtedGameModel)).toStrictEqual(expectedGameEntity);
    });


    test("method toGameEntity is called with a partial GameModel and returns a full GameEntity with omitted properties as undefined", () => {
        const id = dummyId();

        const inputtedGameModel = new GameModel({
            ...omitProps(dummyGameModel(), ['developer']),
            id: id
        });

        const expectedGameEntity = new GameEntity({
            ...dummyGameEntity(),
            developer: undefined,
            id: id
        });

        expect(handler.toGameEntity(inputtedGameModel)).toStrictEqual(expectedGameEntity);
    });

    test("method toGameModel is called with a full GameEntity and returns a full GameModel", () => {
        const id = dummyId();

        const inputtedGameEntity = new GameEntity({
            ...dummyGameEntity(),
            id: id
        });

        const expectedGameModel = new GameModel({
            ...dummyGameModel(),
            id: id
        });

        expect(handler.toGameModel(inputtedGameEntity)).toStrictEqual(expectedGameModel);
    });

    test("method toGameModel is called with a partial GameEntity and returns a full GameModel with omitted properties as undefined", () => {
        const id = dummyId();

        const inputtedGameEntity = new GameEntity({
            ...omitProps(dummyGameEntity(), ['developer']),
            id: id
        })

        const expectedGameModel = new GameModel({
            ...dummyGameModel(),
            developer: undefined,
            id: id
        })

        expect(handler.toGameModel(inputtedGameEntity)).toStrictEqual(expectedGameModel);
    });

    test("method gameIdExists is called with valid id and returns true", async () => {
        findByIdMock.mockResolvedValueOnce(true);

        expect(handler.gameIdExists('valid_id'))
            .toStrictEqual(Promise.resolve(true));

        expect(findByIdMock).toBeCalledTimes(1);
    });

    test("method gameIdExists is called with an invalid id and returns false", async () => {
        findByIdMock.mockResolvedValueOnce(false);

        expect(handler.gameIdExists('invalid_id'))
            .toStrictEqual(Promise.resolve(false));

        expect(findByIdMock).toBeCalledTimes(1);
    });

    test("method gameDetailsExist is called with valid details returns true", async () => {
        findMock.mockResolvedValueOnce(true);

        expect(handler.gameDetailsExist('dummydev', 2006, 'dummytitle'))
            .toStrictEqual(Promise.resolve(true));

        expect(findMock).toBeCalledTimes(1);
    });

    test("method gameDetailsExist is called with invalid details returns false", async () => {
        findMock.mockResolvedValueOnce(true);

        expect(handler.gameDetailsExist('existingdev', 2006, 'dummytitle'))
            .toStrictEqual(Promise.resolve(true));

        expect(findMock).toBeCalledTimes(1);
    });

    test("toBasicGame returns a BasicGame", () => {
        const id: string = dummyId();

        const entity: GameEntity = {
            ...dummyGameEntity(),
            id: id
        };

        const expectedGame: BasicGame = {
            ...pickProps(dummyGameModel(), ['id', 'title', 'year', 'developer']),
            id: id
        };

        expect(handler.toBasicGameModel(entity)).toStrictEqual(expectedGame);
    });

    test("toFullGame returns a FullGame", () => {
        const id: string = dummyId();

        const entity: GameEntity = {
            ...dummyGameEntity(),
            id: id
        };

        const expectedGame: FullGame = {
            ...dummyGameModel(),
            id: id
        };

        expect(handler.toFullGameModel(entity)).toStrictEqual(expectedGame);
    });

});
