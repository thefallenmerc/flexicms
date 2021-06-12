import database from "../config/database.config";

/**
 * The input model
 */
interface IModelFieldInput {
    identifier: string;
    type: string;
    model: string;
    ref?: string;
}

/**
 * The document model
 */
export interface IModelField extends IModelFieldInput {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * The type of field available
 */
export enum ModelFieldType {
    text = "text", // to indicate a text
    file = "file", // to indicate a file
    image = "image", // to indicate an image
    ref = "ref", // to hold reference of another model
}

/**
 * The model class
 */
export default class ModelField {
    /**
     * Create Model
     * @param model IUserInput
     * @returns IModel
     */
    public static async create(model: IModelFieldInput): Promise<IModelField> {
        if (database.db) {
            // save user
            const result = await database.db.collection("model_fields").insertOne({
                ...model,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            return result.ops[0] as IModelField;
        } else {
            throw new Error("Database not initialized!");
        }
    }

    /**
     * Create multiple field models
     * @param models Array<IModelFieldInput>
     * @returns Promise<Array<IModelField>>
     */
    public static async createMany(models: Array<IModelFieldInput>): Promise<Array<IModelField>> {
        if (database.db) {
            const result = await database.db.collection("model_fields").insertMany(
                models.map((model) => ({
                    ...model,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }))
            );

            return result.ops as Array<IModelField>;
        } else {
            throw new Error("Database not initialized!");
        }
    }

    /**
     * Find Model fields by model id
     * @param identifier string
     * @returns Promise<IModel>
     */
    public static async findFieldsByModelId(modelId: string): Promise<Array<IModelField>> {
        if (database.db) {
            const result = await database.db.collection("model_fields").find({ model: modelId }).toArray();

            return result as Array<IModelField>;
        } else {
            throw new Error("Database not initialized!");
        }
    }
}
