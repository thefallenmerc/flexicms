import { ObjectId } from "mongodb";
import database from "../config/database.config";
/**
 * The model class
 */
export default class ModelData {
    /**
     * Create Model data
     * @param model any
     * @returns any
     */
    public static async create(modelId: string, modelDataInput: any = {}) {
        if (database.db) {
            // save user
            const result = await database.db.collection("model_data").insertOne({
                ...modelDataInput,
                model: modelId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            return result.ops[0];
        } else {
            throw new Error("Database not initialized!");
        }
    }

    /**
     * Create multiple field models
     * @param models Array<any>
     * @returns Promise<Array<any>>
     */
    public static async createMany(modelId: string, modelData: Array<any>): Promise<Array<any>> {
        if (database.db) {
            const result = await database.db.collection("model_data").insertMany(
                modelData.map((model) => ({
                    ...model,
                    model: modelId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }))
            );

            return result.ops as Array<any>;
        } else {
            throw new Error("Database not initialized!");
        }
    }

    /**
     * Find Model data by model id
     * @param identifier string
     * @returns Promise<IModel>
     */
    public static async findDataByDataId(dataId: string): Promise<any> {
        if (database.db) {
            const result = await database.db.collection("model_data").findOne({ _id: new ObjectId(dataId) });
            return result;
        } else {
            throw new Error("Database not initialized!");
        }
    }

    /**
     * Find Model data by model id and delete it
     * @param identifier string
     * @returns Promise<IModel>
     */
    public static async deleteDataByDataId(dataId: string): Promise<any> {
        if (database.db) {
            const result = await database.db.collection("model_data").deleteOne({ _id: new ObjectId(dataId) });
            return result;
        } else {
            throw new Error("Database not initialized!");
        }
    }

    /**
     * Find Model data by model id
     * @param identifier string
     * @returns Promise<IModel>
     */
    public static async findDataByModelId(modelId: string): Promise<Array<any>> {
        if (database.db) {
            const result = await database.db.collection("model_data").find({ model: modelId }).toArray();

            return result as Array<any>;
        } else {
            throw new Error("Database not initialized!");
        }
    }
}
