import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import Validator from "validatorjs";

export default class AuthenticationController {
    public static async register(req: Request, res: Response) {
        // validate the user
        const validator = new Validator(req.body, {
            name: "string|required|min:2",
            email: "email|required|min:5",
            password: "string|required|min:5",
        });

        if (validator.fails()) {
            return res.status(422).json({
                message: "Validator failed!",
                errors: validator.errors,
            });
        }

        // get the data
        const { email, password, name } = req.body;

        // check if user email already taken
        if (await User.findOneByEmail(email)) {
            return res.status(422).json({
                message: "Validator failed!",
                errors: {
                    email: ["email already taken"],
                },
            });
        }

        // create the user
        const user = await User.create({
            name,
            email,
            password,
        });

        return res.json({ message: "User created", user: AuthenticationController.getUserResource(user) });
    }

    public static async login(req: Request, res: Response) {
        // validate the input
        const validator = new Validator(req.body, {
            email: "required|email",
            password: "required|string",
        });

        if (validator.fails()) {
            return res.status(422).json({
                message: "Validator failed!",
                errors: validator.errors,
            });
        }

        // get the data
        const { email, password } = req.body;

        // check user credentials
        const { user, matchFound } = await User.getUserWithCredentials(email, password);
        if (!matchFound) {
            return res.status(401).json({
                message: "Incorrect credentials!",
            });
        }

        // return response
        return res.json({ message: "Login successful!", user: AuthenticationController.getUserResource(user) });
    }

    public static getUserResource(user: IUser) {
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }
}
