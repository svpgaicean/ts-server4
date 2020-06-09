import { IGameRepo, getGameRepo } from "../../persistence/getGameRepository";
import { GameEntity } from "../../persistence/entities/GameEntity";
import { RegisterGame, FullGame, BasicGame, PartialUpdateGame } from "../../types/GameTypes";
import { omitProps, pickProps } from "../../utils/Functions";
import { Validation } from "../../utils/Validation";
import { CustomError } from "../../utils/ErrorHandler";
import { GameEcho } from "../../utils/Enums";
import { GameModel, createGameModel } from "../models/GameModel";
import { validateOrReject } from "class-validator";

export class GameHandler {
    private gameRepo: IGameRepo;

    constructor() {
        this.gameRepo = getGameRepo();
    }

    public async createGame(model: RegisterGame): Promise<FullGame> {
        const gameModel: GameModel = createGameModel(model);

        await validateOrReject(gameModel, { groups: [Validation.CREATE] })
            .catch(errors => { throw new CustomError(400, 'Invalid Model', [errors]) });

        const partialEntity = omitProps<GameEntity>(this.toGameEntity(gameModel), ['id']);

        if (await this.gameDetailsExist(
            partialEntity.title,
            partialEntity.year,
            partialEntity.developer
        ))
            throw new CustomError(400, "Game Already Exists");

        const entity: GameEntity = await this.gameRepo.create(partialEntity);

        return this.toFullGameModel(entity);
    }

    public async getGame(id: string, details: string): Promise<BasicGame | FullGame> {
        const entity: GameEntity = await this.gameRepo.findById(id);
        if (!entity)
            throw new CustomError(404, 'Game Not Found');

        switch (details) {
            case GameEcho.BASIC:
                return this.toBasicGameModel(entity);
            case GameEcho.FULL:
                return this.toFullGameModel(entity);
        }
    }

    public async getAllGames(details: string): Promise<BasicGame[] | FullGame[]> {
        const entities: GameEntity[] = await this.gameRepo.find();

        return Promise.all(entities.map((game) => {
            switch (details) {
                case GameEcho.BASIC:
                    return this.toBasicGameModel(game);
                case GameEcho.FULL:
                    return this.toFullGameModel(game);
            }
        }));
    }

    public async updateGame(id: string, model: PartialUpdateGame, group: Validation): Promise<FullGame> {
        const gameModel = createGameModel(model);

        await validateOrReject(gameModel, { groups: [group] })
            .catch(errors => { console.log(errors);
                throw new CustomError(400, 'Invalid Model', [errors]) });

        if (!await this.gameIdExists(gameModel.id))
            throw new CustomError(404, 'Game Not Found');

        if (gameModel.title || gameModel.year || gameModel.developer) {
            if (gameModel.title != null && gameModel.year != null && gameModel.developer != null) {
                if (await this.gameDetailsExist(
                    gameModel.title,
                    gameModel.year,
                    gameModel.developer
                ))
                    throw new CustomError(400, 'Game Already Exists');
            }
            else
                throw new CustomError(400, 'Game Details Missing');
        }

        const partialEntity = omitProps<GameEntity>(this.toGameEntity(gameModel), ['id']);

        return this.toGameModel(await this.gameRepo.update(id, partialEntity));
    }

    public async deleteGame(id: string): Promise<boolean> {
        if (!await this.gameIdExists(id))
            throw new CustomError(404, 'Game Not Found');

        return await this.gameRepo.delete(id);
    }

    public toGameEntity(model: Partial<GameModel>): GameEntity {
        return new GameEntity({
            id: model.id,
            title: model.title,
            year: model.year,
            genre: model.genre,
            developer: model.developer,
            publisher: model.publisher,
            platforms: model.platforms,
            digital_distribution: model.digital_distribution
        });
    }

    public toGameModel(entity: Partial<GameEntity>): GameModel {
        return new GameModel({
            id: entity.id,
            title: entity.title,
            year: entity.year,
            genre: entity.genre,
            developer: entity.developer,
            publisher: entity.publisher,
            platforms: entity.platforms,
            digital_distribution: entity.digital_distribution
        });
    }

    public toBasicGameModel(entity: Partial<GameEntity>): BasicGame {
        return pickProps<GameModel>(
            this.toGameModel(entity),
            ['id', 'title', 'year', 'developer']
        );
    }

    public toFullGameModel(entity: Partial<GameEntity>): FullGame {
        return omitProps<GameModel>(this.toGameModel(entity));
    }

    public async gameIdExists(id: string): Promise<boolean> {
        return !!(await this.gameRepo.findById(id));
    }

    public async gameDetailsExist(title: string, year: number, developer: string): Promise<boolean> {
        return !!(await this.gameRepo.find(
            {
                title: title,
                year: year,
                developer: developer
            }
        ));
    }

}
