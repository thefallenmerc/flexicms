import { IUser } from "models/user.model";
import { Request } from "express";

export interface IUserRequest extends Request {
    user?: IUser;
    authToken?: string;
}
