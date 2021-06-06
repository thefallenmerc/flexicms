import MainController from "../controllers/main.controller";
import { Router } from "express";
import AuthenticationController from "../controllers/authentication.controller";

const apiRouter = Router();

apiRouter.get("/", MainController.root);
apiRouter.post("/auth/register", AuthenticationController.register);
apiRouter.post("/auth/login", AuthenticationController.login);

export default apiRouter;
