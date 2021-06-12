import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { IUserRequest } from "types/express";
import User, { IUser } from "../models/user.model";

/**
 * Authenticate middleware
 */
async function AuthMiddleware(req: IUserRequest, res: Response, next: NextFunction) {
    // get the authorization header
    const { authorization } = req.headers;

    // if not available return failure response
    if (!authorization) {
        return res.status(401).json({
            message: "Unauthenticated!",
        });
    }

    // get token from header
    const [, token] = authorization.split(" ");

    // try decoding the token
    try {
        const userData = (await jwt.verify(token, process.env.APP_KEY ?? "")) as IUser;
        const user = await User.findOneByEmail(userData.email);

        // if cannot find user return unauthenticated
        if (!user) {
            return res.status(401).json({
                message: "Unauthenticated!",
            });
        }

        // add user to request
        req.user = user;
        req.authToken = token;

        // perform next request
        return next();
    } catch (error) {
        // return unauthenticated
        return res.status(401).json({
            message: "Unauthenticated!",
        });
    }
}

export default AuthMiddleware;
