import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import { RequestRecipeService } from "./R.Recipes.service";

// create Request Recipes from Controller
const createRequestRecipe = catchAsync(async (req: Request, res: Response) => {
    const recipe = req.body;
    const result = await RequestRecipeService.createRequestRecipe(recipe);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create request recipe")
    }
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Request recipe created successfully",
        data: result
    })
})

// update Request Recipe
const updateRequestRecipe = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateData = req.body;
    const result = await RequestRecipeService.updateRequestRecipeZodSchema(id, updateData);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update request recipe")
    }
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Request recipe updated successfully",
        data: result
    })
})
const getAllRequestRecipe = catchAsync(async (req: Request, res: Response) => {
    const result = await RequestRecipeService.getAllRequestRecipe();
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to get all request recipe")
    }
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Request recipe fetched successfully",
        data: result
    })
})
const getSingleRequestRecipe = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await RequestRecipeService.getSingleRequestRecipe(id);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to get single request recipe")
    }
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Request recipe fetched successfully",
        data: result
    })
})



// export function to get all request recipes
export const RequestRecipeController = {
    createRequestRecipe,
    updateRequestRecipe,
    getAllRequestRecipe,
    getSingleRequestRecipe
}