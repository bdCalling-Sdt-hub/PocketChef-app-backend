import { StatusCodes } from "http-status-codes"
import ApiError from "../../../errors/ApiErrors"
import { IRequestRecipes } from "./R.Recipes.interface"
import { RequestRecipe } from "./R.Recipes.model"

const createRequestRecipe = async (payload: IRequestRecipes) => {
    const result = await RequestRecipe.create(payload)
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create request recipe')
    }
    return result
}

const updateRequestRecipeZodSchema = async (id: string, payload: Partial<IRequestRecipes>) => {
    const result = await RequestRecipe.findByIdAndUpdate(
        id,
        payload,
        { new: true }
    );
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update request recipe')
    }
    return result;
}


export const RequestRecipeService = {
    createRequestRecipe,
    updateRequestRecipeZodSchema
}