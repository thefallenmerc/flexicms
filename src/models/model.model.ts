import database from "../config/database.config";
import ModelField, { IModelField } from "./model_field.model";

interface IModelInput {
    name: string;
    identifier: string;
    createdBy: string;
}

export interface IModel extends IModelInput {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IModelWithFields extends IModel {
    fields: Array<IModelField>;
}

export default class Model {
    /**
     * Create Model
     * @param model IUserInput
     * @returns IModel
     */
    public static async create(model: IModelInput): Promise<IModel> {
        if (database.db) {
            // save user
            const result = await database.db.collection("models").insertOne({
                ...model,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            return result.ops[0] as IModel;
        } else {
            throw new Error("Database not initialized!");
        }
    }

    /**
     * Find Model by identifier
     * @param identifier string
     * @returns Promise<IModel>
     */
    public static async findOneByIdentifier(identifier: string): Promise<IModel> {
        if (database.db) {
            const result = await database.db.collection("models").findOne({ identifier });

            return result as IModel;
        } else {
            throw new Error("Database not initialized!");
        }
    }

    /**
     * Find Models based on condition
     * @param conditions object
     * @returns Promise<Cursor<IModel>>
     */
    public static async find(conditions: any = {}): Promise<Array<IModel>> {
        if (database.db) {
            const result = await database.db.collection("models").find(conditions).toArray();

            return result as Array<IModel>;
        } else {
            throw new Error("Database not initialized!");
        }
    }

    /**
     * Find Model by identifier with fields populated
     * @param identifier string
     * @returns Promise<IModel>
     */
    public static async findOneByIdentifierWF(identifier: string): Promise<IModelWithFields> {
        if (database.db) {
            const result = await database.db.collection("models").findOne({ identifier });

            // if there is result, add fields too
            if (result) {
                result.fields = ModelField.findFieldsByModelId(result._id);
            }

            return result as IModelWithFields;
        } else {
            throw new Error("Database not initialized!");
        }
    }
}
