import { Response } from "express";
import Model, { IModel } from "../models/model.model";
import Validator from "validatorjs";
import { IUserRequest } from "types/express";
import ModelField, { IModelField, ModelFieldType } from "../models/model_field.model";

export default class ModelController {
    /**
     * Create a new model
     */
    public static async create(req: IUserRequest, res: Response) {
        // validate the model
        const validator = new Validator(req.body, {
            name: "string|required|min:2",
            identifier: "string|required|min:2|alpha",
            fields: "required|array|min:1",
            "fields.*.identifier": "string|required|min:2|alpha",
            "fields.*.type": "string|required|in:" + Object.keys(ModelFieldType).join(","),
            "fields.*.validations": "required|string",
            "fields.*.ref": "string|required_if:fields.*.type," + ModelFieldType.ref,
        });

        if (validator.fails()) {
            return res.status(422).json({
                message: "Validator failed!",
                errors: validator.errors,
            });
        }

        // TODO: add check to validate the validation rules

        // get the data
        const { name, identifier, fields } = req.body;

        // check if model identifier already taken
        if (await Model.findOneByIdentifier(identifier)) {
            return res.status(422).json({
                message: "Validator failed!",
                errors: {
                    identifier: ["identifier already taken"],
                },
            });
        }

        // create the model
        const model = await Model.create({
            name,
            identifier,
            createdBy: req.user?._id ?? "",
        });

        // create the model fields
        const modelFields = await ModelField.createMany(
            fields.map((field: any) => ({
                ...field,
                model: model._id,
            }))
        );

        // return response
        return res.json({
            message: "Model created!",
            user: ModelController.getModelResource(model, modelFields),
        });
    }

    /**
     * Get all available models
     * @param req Request
     * @param res Response
     * @returns Response
     */
    public static async getAll(req: IUserRequest, res: Response) {
        if (req.user) {
            const models = await Model.find();

            // return response
            return res.json({
                message: "All Models!",
                models: await ModelController.getModelsResourceWithFields(models),
            });
        }
    }

    public static async delete(req: IUserRequest, res: Response) {
        if (req.user) {
            await Model.deleteOneByIndentifier(req.params.modelIdentifier);

            // return response
            return res.json({
                message: "Model deleted!",
            });
        }
    }

    public static getModelResource(model: IModel, modelFields: Array<IModelField>) {
        return {
            id: model._id,
            name: model.name,
            identifier: model.identifier,
            createdBy: model.createdBy,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            modelFields,
        };
    }

    public static async getModelsResourceWithFields(models: Array<IModel>) {
        const modelsWithFields = [];
        for (const model of models) {
            modelsWithFields.push({
                ...model,
                fields: await ModelField.findFieldsByModelId(model._id),
            });
        }

        console.log([await ModelField.findFieldsByModelId("60c4285c79cc8f19ee8fbb69")]);

        return modelsWithFields;
    }
}
