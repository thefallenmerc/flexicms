import MainController from "../controllers/main.controller";
import { Router } from "express";
import AuthenticationController from "../controllers/authentication.controller";
import ModelController from "../controllers/model.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

const apiRouter = Router();

apiRouter.get("/", MainController.root);
apiRouter.post("/auth/register", AuthenticationController.register);
apiRouter.post("/auth/login", AuthenticationController.login);

// model routes
apiRouter.get("/admin/model", AuthMiddleware, ModelController.getAll);
apiRouter.post("/admin/model", AuthMiddleware, ModelController.create);

export default apiRouter;
