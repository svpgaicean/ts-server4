import dotenv from "dotenv";

dotenv.config();
export const {
    PORT,
    NODE_ENV,
    DB_CONNECTION, 
    DB_HOST, 
    DB_DATABASE
} = process.env;
