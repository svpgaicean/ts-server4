import { ObjectProps } from "./GeneralTypes";
import { UserModel } from "../services/models/UserModel";

// default returned model
export type User = Omit<UserModelProps, 'password'>;

// CRUD types
export type RegisterUser = Omit<Required<UserModelProps>, 'id' | 'wishlist'>;
export type FullUpdateUser = Omit<Required<UserModelProps>, 'id' | 'password'>;
export type PartialUpdateUser = Omit<Partial<UserModelProps>, 'id' | 'password'>;

// misc
export type CreateUserModel = Partial<UserModelProps>;
export type UserExists = Partial<Pick<UserModelProps, 'id' | 'email'>>;

type UserModelProps = ObjectProps<UserModel>;
