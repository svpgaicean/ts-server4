import { ObjectProps } from "./GeneralTypes";
import { GameModel } from "../services/models/GameModel";

// default returned model
export type BasicGame = Pick<GameModelProps, 'id' | 'title' | 'year' | 'developer'>;
export type FullGame = GameModelProps;

// CRUD types
export type RegisterGame = Omit<Required<GameModelProps>, 'id'>;
export type FullUpdateGame = Omit<Required<GameModelProps>, 'id'>;
export type PartialUpdateGame = Omit<Partial<GameModelProps>, 'id'>;

// misc
export type CreateGameModel = Partial<GameModelProps>;
export type GameExists = Partial<Pick<GameModelProps, 'id' | 'title' | 'year' | 'developer'>>;

type GameModelProps = ObjectProps<GameModel>;

export type G1 = Pick<GameModelProps, 'id'>;
export type G2 = Pick<GameModelProps, 'title' | 'year' | 'developer'>;
