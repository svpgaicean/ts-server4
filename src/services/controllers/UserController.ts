import { JsonController, Param, Body, Get, Post, Put, Delete, QueryParam } from "routing-controllers";
import { UserHandler } from "../handlers/UserHandler";
import { UserEcho } from "../../utils/Enums";
import { validateBody, Validation } from "../../utils/Validation";
import { CustomError } from "../../utils/ErrorHandler";
import { RegisterUser, User, FullUpdateUser, PartialUpdateUser } from "../../types/UserTypes";
import { omitProps } from "../../utils/Functions";
import { UserModel, dummyUserModel } from "../models/UserModel";

@JsonController()
export class UserController {

    public handler: UserHandler;

    constructor() {
        this.handler = new UserHandler();
    }

    @Post("/users")
    async register(@Body() model: RegisterUser): Promise<User> {

        const validBody = validateBody(
            model,
            omitProps<UserModel>(dummyUserModel(), ['id', 'wishlist']),
            Validation.CREATE
        );
        if (!validBody)
            throw new CustomError(400, 'Invalid Body');

        return await this.handler.createUser(model);
    }

    @Get("/users/:id")
    async getOne(
        @Param("id") id: string,
        @QueryParam("wishlist") wishlist: string = UserEcho.ID
    ): Promise<User> {

        if (Object.values(UserEcho).toString().indexOf(wishlist) === -1)
            throw new CustomError(400, 'Invalid Query Param');

        return await this.handler.getUser(id, wishlist);
    }
    
    @Get("/users")
    async getAll(): Promise<User[]> {
        return await this.handler.getAllUsers();
    }


    @Put("/users/:id")
    async fullUpdate(@Param("id") id: string, @Body() model: FullUpdateUser)
        : Promise<User> {

        const validBody = validateBody(
            model,
            omitProps<UserModel>(dummyUserModel(), ['id', 'password']),
            Validation.FULL
        );
        if (!validBody)
            throw new CustomError(400, 'Invalid Body');

        return await this.handler.updateUser(id, model, Validation.FULL);
    }

    @Post("/users/:id")
    async partialUpdate(@Param("id") id: string, @Body() model: PartialUpdateUser)
        : Promise<User> {

        const validBody = validateBody(
            model,
            omitProps<UserModel>(dummyUserModel(), ['id', 'password']),
            Validation.PARTIAL
        );
        if (!validBody)
            throw new CustomError(400, 'Invalid Body');

        return await this.handler.updateUser(id, model, Validation.PARTIAL);
    }

    @Delete("/users/:id")
    async remove(@Param("id") id: string): Promise<void> {
        const deleted = await this.handler.deleteUser(id);

        if (!deleted)
            throw new CustomError(500);
        return null;
    }
}
