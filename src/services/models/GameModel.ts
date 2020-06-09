import { IsDefined, IsOptional, IsNumber, Min } from "class-validator";
import { Model } from "./Model";
import { ApiStringField, Validation } from "../../utils/Validation";
import { CreateGameModel } from "../../types/GameTypes";
import { dummyId } from "../../utils/Functions";

export class GameModel extends Model<GameModel> {
    @ApiStringField(2, 50)
    title: string;

    @IsNumber({}, { always: true })
    @Min(1958, { always: true })
    @IsDefined({ groups: [Validation.FULL, Validation.CREATE] })
    @IsOptional({ groups: [Validation.PARTIAL] })
    year: number;

    @ApiStringField(2, 50)
    genre: string;

    @ApiStringField(2, 50)
    developer: string;

    @ApiStringField(2, 50)
    publisher: string;

    @ApiStringField(2, 50, true)
    platforms: string[];

    @ApiStringField(2, 50)
    digital_distribution: string;
}

export function createGameModel(model: CreateGameModel): GameModel {
    return new GameModel({
        title: model.title,
        year: model.year,
        genre: model.genre,
        developer: model.developer,
        publisher: model.publisher,
        platforms: model.platforms,
        digital_distribution: model.digital_distribution,
        id: model.id
    });
}

export function dummyGameModel(): GameModel {
    return new GameModel({
        title: 'Diablo',
        year: 1997,
        genre: 'action role-playing',
        developer: 'Blizzard North',
        publisher: 'Blizzard Entertainment',
        platforms: ['Microsoft Windows', 'PlayStation'],
        digital_distribution: 'none',
        id: dummyId()
    });
}
