import MainController from "../controllers/main.controller";
import { Router } from "express";

const apiRouter = Router();

apiRouter.get("/", MainController.root);

export default apiRouter;
