import { Schema } from "mongoose";

const GameSchemaObject = {
    title: String,
    year: Number,
    genre: String,
    developer: String,
    publisher: String,
    platforms: [String],
    digital_distribution: String
}

export const GameSchema = new Schema(GameSchemaObject);
