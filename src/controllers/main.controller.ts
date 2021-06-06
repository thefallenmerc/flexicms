import { Request, Response } from "express";

class MainController {
    static async root(req: Request, res: Response) {
        return res.json({
            hello: "world",
        });
    }
}

export default MainController;
