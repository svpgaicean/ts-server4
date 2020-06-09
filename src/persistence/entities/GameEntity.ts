import { Entity } from "./Entity";
import { dummyId } from "../../utils/Functions";

export class GameEntity extends Entity<GameEntity> {
    title: string;
    year: number;
    genre: string;
    developer: string;
    publisher: string;
    platforms: string[];
    digital_distribution: string;
}

export function dummyGameEntity(): GameEntity {
    return new GameEntity({
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
