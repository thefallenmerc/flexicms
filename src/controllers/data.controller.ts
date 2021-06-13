import { Request, Response } from "express";
import ModelData from "../models/model_data.model";
import Validator from "validatorjs";
import Model, { IModel } from "../models/model.model";
import ModelField, { IModelField } from "../models/model_field.model";

export default class DataController {
    /**
     * Add data to model
     * @param req Request
     * @param res Response
     */
    public static async add(req: Request, res: Response) {
        // get model identifier
        const { modelIdentifier } = req.params;

        // get the model
        const model = await Model.findOneByIdentifier(modelIdentifier);

        if (!model) {
            return res.status(404).json({
                message: "Model not found",
            });
        }

        // get the model fields
        const modelFields = await ModelField.findFieldsByModelId(model._id);

        // create validation rules
        const rules = modelFields.reduce((acc, value) => {
            acc[value.identifier] = value.validations;
            return acc;
        }, {} as any);

        // create payload body
        const payload = modelFields.reduce((acc, value) => {
            acc[value.identifier] = req.body[value.identifier];
            return acc;
        }, {} as any);

        // validate the model data
        const validator = new Validator(payload, rules);

        if (validator.fails()) {
            return res.status(422).json({
                message: "Validator failed!",
                errors: validator.errors,
            });
        }

        // all good, create the record
        const data = await ModelData.create(model._id, payload);

        return res.json({
            message: model.name + " created!",
            [model.identifier]: data,
        });
    }

    /**
     * Get all data from the model data
     * @param req Request
     * @param res Response
     * @returns any
     */
    public static async getAll(req: Request, res: Response) {
        // get model identifier
        const { modelIdentifier } = req.params;

        // get the model
        const model = await Model.findOneByIdentifier(modelIdentifier);

        if (!model) {
            return res.status(404).json({
                message: "Model not found",
            });
        }

        const data = await ModelData.findDataByModelId(model._id);

        return res.json({
            message: model.name + " list!",
            [model.identifier]: data,
        });
    }

    /**
     * Delete data from model_data
     * @param req Request
     * @param res Response
     * @returns any
     */
    public static async delete(req: Request, res: Response) {
        // get model identifier
        const { modelIdentifier, dataIdentifier } = req.params;

        // get the model
        const model = await Model.findOneByIdentifier(modelIdentifier);

        if (!model) {
            return res.status(404).json({
                message: "Model not found",
            });
        }

        // get the data
        const data = await ModelData.findDataByDataId(dataIdentifier);

        if (!data) {
            return res.status(404).json({
                message: "Data not found",
            });
        }

        // delete the data
        await ModelData.deleteDataByDataId(dataIdentifier);

        // delete the model
        return res.json({
            message: "Data deleted!",
            [model.identifier]: data,
        });
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
}
