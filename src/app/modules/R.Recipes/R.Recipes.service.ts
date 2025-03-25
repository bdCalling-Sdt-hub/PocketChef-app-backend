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

const getAllRequestRecipe = async () => {
    const result = await RequestRecipe.find({}).populate("userId", "name email profile")
    console.log("Result", result);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get all request recipe')
    }
    return result
}

const getSingleRequestRecipe = async (id: string) => {
    const result = await RequestRecipe.findById(id)
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get single request recipe')
    }
    return result
}

// get single recipe request by user id
const getSingleRecipeRequestByUserId = async (userId: string) => {
    const result = await RequestRecipe.find({ userId }).populate("userId")
    if (!result || result.length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'No recipe requests found for this user id')
    }
    return result
}



export const RequestRecipeService = {
    createRequestRecipe,
    updateRequestRecipeZodSchema,
    getAllRequestRecipe,
    getSingleRequestRecipe,
    getSingleRecipeRequestByUserId
}