import express, { Application } from "express";
import dotenv from "dotenv";
import logger from "morgan";

import webRouter from "./routes/web.route";
import apiRouter from "./routes/app.route";

// create app
const app: Application = express();

// load env variables
dotenv.config();

// add debug logger
if (process.env.NODE_ENV !== "test") {
    app.use(logger("dev"));
}

// initialize routes
app.use("/", webRouter);
app.use("/api", apiRouter);

// export the app
export default app;
