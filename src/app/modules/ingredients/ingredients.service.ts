import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { IIngredients, IngredientsModel } from './ingredients.interface';
import { Ingredients } from './ingredients.model';


const createIngredientsIntoDB = async (payload: IIngredients): Promise<IIngredients | null> => {
    const result = await Ingredients.create(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create ingredients");
    }
    return result;
};


const getAllIngredientsFromDB = async (): Promise<IIngredients[] | null> => {
    const result = await Ingredients.find();
    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Ingredients not found");
    }
    return result;
};


const getSingleIngredientsFromDB = async (id: string): Promise<IIngredients | null> => {
    const result = await Ingredients.findById(id);
    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Ingredients not found");
    }
    return result;
};


const updateIngredientsIntoDB = async (id: string, payload: IIngredients): Promise<IIngredients | null> => {
    const result = await Ingredients.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Ingredients not found");
    }
    return result;
};


const deleteIngredientsFromDB = async (id: string): Promise<IIngredients | null> => {
    const result = await Ingredients.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Ingredients not found");
    }
    return result;
};


export const IngredientsServices = {
    createIngredientsIntoDB,
    getAllIngredientsFromDB,
    getSingleIngredientsFromDB,
    updateIngredientsIntoDB,
    deleteIngredientsFromDB,
};
