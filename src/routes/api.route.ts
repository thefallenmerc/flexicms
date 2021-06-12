import MainController from "../controllers/main.controller";
import { Router } from "express";
import AuthenticationController from "../controllers/authentication.controller";
import ModelController from "../controllers/model.controller";
import AuthMiddleware from "../middlewares/auth.middleware";
import DataController from "../controllers/data.controller";

const apiRouter = Router();

apiRouter.get("/", MainController.root);
apiRouter.post("/auth/register", AuthenticationController.register);
apiRouter.post("/auth/login", AuthenticationController.login);

// admin routes
// model routes
apiRouter.get("/admin/model", AuthMiddleware, ModelController.getAll);
apiRouter.post("/admin/model", AuthMiddleware, ModelController.create);
apiRouter.delete("/admin/model/:modelIdentifier", AuthMiddleware, ModelController.delete);

// consumable routes
apiRouter.get("/data/:modelIdentifier/", ModelController.getAll);
apiRouter.post("/data/:modelIdentifier/", DataController.add);

export default apiRouter;
