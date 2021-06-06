import express, { Application } from "express";
import dotenv from "dotenv";
import logger from "morgan";
import path from "path";

import cors from "cors";

import database from "./config/database.config";

import webRouter from "./routes/web.route";
import apiRouter from "./routes/api.route";

// create app
const app: Application = express();

async function initializeApp(): Promise<Application> {
    // load env variables
    dotenv.config({ path: path.join(__dirname, ".env") });

    // add cors support
    app.use(cors());

    // initialize database
    await database.init();

    // add debug logger
    if (process.env.NODE_ENV !== "test") {
        app.use(logger("dev"));
    }

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // initialize routes
    app.use("/", webRouter);
    app.use("/api", apiRouter);

    return app;
}

// export the app
export default initializeApp;
