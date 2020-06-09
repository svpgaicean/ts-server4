import { MongoDB } from "./mongodb/MongoDB";
import { Repository } from "./Repository";
import { UserEntity } from "./entities/UserEntity";
import { UserSchema } from "./mongodb/schemas/UserSchema";
import { DbConnection } from "../utils/Enums";

let userRepo: IUserRepo = null;

export interface IUserRepo extends Repository<UserEntity> { }

export function getUserRepo(): IUserRepo {
    if (!userRepo) {
        switch (process.env.DB_CONNECTION) {
            case DbConnection.MONGODB:
                userRepo = new Repository(new MongoDB('users', UserSchema));
                break;
            default:
                break;
        }
    }

    return userRepo;
}
