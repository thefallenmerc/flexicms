import database from "../config/database.config";
import bcrypt from "bcrypt";

interface IUserInput {
    name?: string;
    email: string;
    role?: string;
    password: string;
}

export interface IUser {
    _id: string;
    name?: string;
    email: string;
    role: string;
    password: string;
}

// class UserObject {
//     public name: String | undefined;
//     public email: String;
//     public password: String;

//     constructor({ name, email, password }: IUser) {
//         this.name = name;
//         this.email = email;
//         this.password = password;
//     }
// }

export default class User {
    /**
     * Create User
     * @param user IUserInput
     * @returns IUser
     */
    public static async create(user: IUserInput): Promise<IUser> {
        if (database.db) {
            // bcrypt user password
            user.password = bcrypt.hashSync(user.password, 10);

            // save user
            const result = await database.db.collection("users").insertOne(user);

            return result.ops[0] as IUser;
        } else {
            throw new Error("Database not initialized!");
        }
    }

    /**
     * Find User by email
     * @param email string
     * @returns Promise<IUser>
     */
    public static async findOneByEmail(email: string): Promise<IUser> {
        if (database.db) {
            const result = await database.db.collection("users").findOne({ email });

            return result as IUser;
        } else {
            throw new Error("Database not initialized!");
        }
    }

    public static async getUserWithCredentials(
        email: string,
        password: string
    ): Promise<{
        user: IUser;
        matchFound: boolean;
    }> {
        if (database.db) {
            // get the user from db
            const user = await database.db.collection("users").findOne({ email });

            // if user is not found, return false
            if (!user)
                return {
                    user,
                    matchFound: false,
                };

            // compare user password
            if (bcrypt.compareSync(password, user.password)) {
                return {
                    user,
                    matchFound: true,
                };
            } else {
                return {
                    user,
                    matchFound: false,
                };
            }
        } else {
            throw new Error("Database not initialized!");
        }
    }
}
