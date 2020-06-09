import "reflect-metadata";
import express from "express";

import { createExpressServer } from "routing-controllers";
import { UserController } from "./services/controllers/UserController";
import { GameController } from "./services/controllers/GameController";
import { PORT, NODE_ENV } from "./config/env";

const app = createExpressServer({
    controllers: [
        UserController,
        GameController
    ]
});

app.use(express.json());

app.listen(PORT, () => {
    console.log(`NODE_ENV: ${NODE_ENV}`)
    console.log(`Listening on port ${PORT}`);
});
