import { IUserRepo, getUserRepo } from "../../persistence/getUserRepository";
import { UserEntity } from "../../persistence/entities/UserEntity";
import { GameHandler } from "./GameHandler";
import { RegisterUser, User, PartialUpdateUser } from "../../types/UserTypes";
import { omitProps, pickProps } from "../../utils/Functions";
import { UserEcho, GameEcho } from "../../utils/Enums";
import { CustomError } from "../../utils/ErrorHandler";
import { Validation } from "../../utils/Validation";
import { FullGame } from "../../types/GameTypes";
import { UserModel, createUserModel } from "../models/UserModel";
import { GameModel } from "../models/GameModel";
import { validateOrReject } from "class-validator";

export class UserHandler {
    private userRepo: IUserRepo;
    private gameHandler: GameHandler;

    constructor() {
        this.userRepo = getUserRepo();
        this.gameHandler = new GameHandler();
    }

    public async createUser(model: RegisterUser): Promise<User> {
        const userModel: UserModel = createUserModel(model);

        await validateOrReject(userModel, { groups: [Validation.CREATE] })
            .catch(errors => { throw new CustomError(400, 'Invalid Model', [errors]) });

        if (await this.userEmailExists(userModel.email))
            throw new CustomError(400, "User Already Exists");

        const partialEntity = omitProps<UserEntity>(
            this.toUserEntity(userModel),
            ['id', 'wishlist']
        );

        const entity: UserEntity = await this.userRepo.create(partialEntity);

        return omitProps<UserModel>(await this.toUserModel(entity), ['password']);
    }

    public async getUser(id: string, wishlist: string): Promise<User> {
        const entity: UserEntity = await this.userRepo.findById(id);
        if (!entity)
            throw new CustomError(404, 'User Not Found');

        return omitProps<UserModel>(await this.toUserModel(entity, wishlist), ['password']);
    }

    public async getAllUsers(): Promise<User[]> {
        const entities: UserEntity[] = await this.userRepo.find();

        return Promise.all(entities.map(async (user) =>
            omitProps<UserModel>(await this.toUserModel(user, UserEcho.ID), ['password'])
        ));
    }

    public async updateUser(id: string, model: PartialUpdateUser, group: Validation)
        : Promise<User> {
        const userModel: UserModel = createUserModel(model);

        await validateOrReject(userModel, { groups: [group] })
            .catch(errors => { throw new CustomError(400, 'Invalid Model', [errors]) });

        if (!await this.userIdExists(userModel.id))
            throw new CustomError(404, 'User Not Found');

        if (userModel.email) {
            if (await this.userEmailExists(userModel.email))
                throw new CustomError(400, 'User Already Exists');
        }

        if (userModel.wishlist) {
            await Promise.all(userModel.wishlist.map(async entry => {
                if (!await this.gameHandler.gameIdExists(entry.id))
                    throw new CustomError(404, `Bad id ${entry.id}`);
            }));
        }

        const partialEntity = omitProps<UserEntity>(
            this.toUserEntity(userModel),
            ['id', 'password']
        );

        const entity: UserEntity = await this.userRepo.update(id, partialEntity);

        return omitProps<UserModel>(await this.toUserModel(entity, UserEcho.ID), ['password']);
    }

    public async deleteUser(id: string): Promise<boolean> {
        if (!await this.userIdExists(id))
            throw new CustomError(404, 'User Not Found');

        return await this.userRepo.delete(id);
    }

    public toUserEntity(model: Partial<UserModel>): UserEntity {
        return new UserEntity({
            id: model.id,
            firstName: model.firstName,
            lastName: model.lastName,
            email: model.email,
            wishlist: this.gamesToIds(model.wishlist),
            password: model.password,
        });
    }

    public async toUserModel(
        entity: Partial<UserEntity>,
        echo: string = UserEcho.ID
    ): Promise<UserModel> {
        return new UserModel({
            id: entity.id,
            firstName: entity.firstName,
            lastName: entity.lastName,
            email: entity.email,
            wishlist: await this.convertToGame(entity.wishlist, echo),
            password: null
        });
    }

    public async userIdExists(id: string): Promise<boolean> {
        return !!(await this.userRepo.findById(id));
    }

    public async userEmailExists(email: string): Promise<boolean> {
        return !!(await this.userRepo.find({ email: email }));
    }

    private gamesToIds(games: GameModel[] = []): string[] {
        return games.map(game => game.id);
    }

    private async convertToGame(
        gameIds: string[] = [],
        echo: string = UserEcho.ID
    ): Promise<GameModel[]> {

        return await Promise.all(gameIds.map(async (id) => {
            const game: GameModel = <FullGame>await this.gameHandler.getGame(id, GameEcho.FULL);
            switch (echo) {
                case UserEcho.ID:
                    return pickProps<GameModel>(game, ['id']);
                case UserEcho.DETAILS:
                    return game;
            }
        }))
    }

}
