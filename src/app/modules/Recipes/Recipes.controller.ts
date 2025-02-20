import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { RecipeService } from "./Recipes.service";
import ApiError from "../../../errors/ApiErrors";

const createRecipe = catchAsync(async (req: Request, res: Response) => {
    const recipeData = req.body;
    // 🔹 Ensure `ingredientName` is an array
    if (typeof recipeData.ingredientName === 'string') {
        try {
            recipeData.ingredientName = JSON.parse(recipeData.ingredientName);
        } catch (error) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid JSON format for ingredientName");
        }
    }

    if (!Array.isArray(recipeData.ingredientName)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "ingredientName must be an array");
    }
    // calculate total time
    recipeData.totalTime = Number(recipeData.prepTime) + Number(recipeData.cookTime);

    const result = await RecipeService.createRecipeIntoDB(recipeData);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Recipe created successfully',
        data: result,
    });
});



// update recipe for 
const updateRecipe = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const recipeData = req.body;

    // Pass the files directly from the request to the service
    const updatedRecipe = await RecipeService.updateRecipeIntoDB(id, recipeData, req?.files as File[]);

    // Send the response with the updated recipe
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Recipe updated successfully',
        data: updatedRecipe,
    });
});


// all recipes
const getAllRecipe = catchAsync(async (req: Request, res: Response) => {
    const paginationOptions = {
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
    }
    const result = await RecipeService.getAllRecipes(paginationOptions);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        Total: result.data.length,
        success: true,
        message: 'All Recipes retrieved successfully',
        data: result,
    })
})

// single recipe
const getSingleRecipe = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await RecipeService.getSingleRecipe(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Single Recipe retrieved successfully',
        data: result,
    })
})


// delete recipe

const deleteRecipe = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await RecipeService.deleteRecipeFromDB(id);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Recipe deleted successfully',
        data: result,
    })
})


export const RecipeController = {
    createRecipe,
    updateRecipe,
    getAllRecipe,
    getSingleRecipe,
    deleteRecipe,

}