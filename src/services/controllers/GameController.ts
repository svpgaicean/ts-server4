import { JsonController, Param, Body, Get, Post, Put, Delete, QueryParam } from "routing-controllers";
import { GameEcho } from "../../utils/Enums";
import { validateBody, Validation } from "../../utils/Validation";
import { CustomError } from "../../utils/ErrorHandler";
import { omitProps } from "../../utils/Functions";
import { GameHandler } from "../handlers/GameHandler";
import { RegisterGame, FullUpdateGame, PartialUpdateGame, BasicGame, FullGame } from "../../types/GameTypes";
import { GameModel, dummyGameModel } from "../models/GameModel";

@JsonController()
export class GameController {

    public handler: GameHandler;

    constructor() {
        this.handler = new GameHandler();
    }

    @Post("/games")
    async register(@Body() model: RegisterGame): Promise<FullGame> {

        const validBody = validateBody(
            model,
            omitProps<GameModel>(dummyGameModel(), ['id']),
            Validation.CREATE
        );
        if (!validBody)
            throw new CustomError(400, 'Invalid Body');

        return await this.handler.createGame(model);
    }

    @Get("/games/:id")
    async getOne(
        @Param("id") id: string,
        @QueryParam("details") details: string = GameEcho.BASIC
    ): Promise<BasicGame | FullGame> {

        if (Object.values(GameEcho).toString().indexOf(details) === -1)
            throw new CustomError(400, 'Invalid Query Param');

        return await this.handler.getGame(id, details);
    }
    
    @Get("/games")
    async getAll(@QueryParam("details") details: string = GameEcho.BASIC)
        : Promise<BasicGame[] | FullGame> {

        if (Object.values(GameEcho).toString().indexOf(details) === -1)
            throw new CustomError(400, 'Invalid Query Param');

        return await this.handler.getAllGames(details);
    }

    @Put("/games/:id")
    async fullUpdate(@Param("id") id: string, @Body() model: FullUpdateGame)
        : Promise<FullGame> {

        const validBody = validateBody(
            model,
            omitProps<GameModel>(dummyGameModel(), ['id']),
            Validation.FULL
        );
        if (!validBody)
            throw new CustomError(400, 'Invalid Body');

        return await this.handler.updateGame(id, model, Validation.FULL);
    }

    @Post("/games/:id")
    async partialUpdate(@Param("id") id: string, @Body() model: PartialUpdateGame)
        : Promise<FullGame> {

        const validBody = validateBody(
            model,
            omitProps<GameModel>(dummyGameModel(), ['id']),
            Validation.PARTIAL
        );
        if (!validBody)
            throw new CustomError(400, 'Invalid Body');

        return await this.handler.updateGame(id, model, Validation.PARTIAL);
    }

    @Delete("/games/:id")
    async remove(@Param("id") id: string): Promise<void> {
        const deleted = await this.handler.deleteGame(id);

        if (!deleted)
            throw new CustomError(500);
        return null;
    }
}
