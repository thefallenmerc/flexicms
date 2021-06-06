import express, { Application } from "express";
import webRouter from "./routes/web.route";

const app: Application = express();

app.use("/", webRouter);

export default app;
