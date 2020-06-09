import { Schema } from "mongoose";

const UserSchemaObject = {
    firstName: String,
    lastName: String,
    email: String,
    wishlist: [String],
    password: String
}

export const UserSchema = new Schema(UserSchemaObject);
