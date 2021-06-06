import MainController from "../controllers/main.controller";
import { Router } from "express";

const webRouter = Router();

webRouter.get("/", MainController.root);

export default webRouter;
