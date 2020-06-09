import { MongoDB } from "./mongodb/MongoDB";
import { Repository } from "./Repository";
import { GameEntity } from "./entities/GameEntity";
import { GameSchema } from "./mongodb/schemas/GameSchema";
import { DbConnection } from "../utils/Enums";

let gameRepo: IGameRepo = null;

export interface IGameRepo extends Repository<GameEntity> { }

export function getGameRepo(): IGameRepo {
    if (!gameRepo) {
        switch (process.env.DB_CONNECTION) {
            case DbConnection.MONGODB:
                gameRepo = new Repository(new MongoDB('games', GameSchema));
                break;
            default:
                break;
        }
    }
    return gameRepo;
}
