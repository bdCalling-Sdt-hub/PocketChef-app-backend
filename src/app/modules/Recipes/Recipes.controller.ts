import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { RecipeService } from "./Recipes.service";
import ApiError from "../../../errors/ApiErrors";

const createRecipe = catchAsync(async (req: Request, res: Response) => {
    const recipeData = req.body;

    const parseArrayField = (field: any, fieldName: string) => {
        if (typeof field === "string") {
            const trimmedField = field.trim();

            if (trimmedField.startsWith("[") && trimmedField.endsWith("]")) {
                try {
                    return JSON.parse(trimmedField);
                } catch (error) {
                    console.warn(`Invalid JSON format for ${fieldName}:`, trimmedField);
                    throw new ApiError(StatusCodes.BAD_REQUEST, `Invalid JSON format for ${fieldName}`);
                }
            }
            return trimmedField.split(",").map((item) => item.trim().replace(/^"(.*)"$/, "$1"));
        }

        return Array.isArray(field) ? field : [];
    };


    recipeData.ingredientName = parseArrayField(recipeData.ingredientName, "ingredientName");
    recipeData.keyIngredients = parseArrayField(recipeData.keyIngredients, "keyIngredients");
    recipeData.dietaryPreferences = parseArrayField(recipeData.dietaryPreferences, "dietaryPreferences");
    recipeData.tags = parseArrayField(recipeData.tags, "tags");
    recipeData.instructions = parseArrayField(recipeData.instructions, "instructions");
    recipeData.NutritionalValue = parseArrayField(recipeData.NutritionalValue, "NutritionalValue")

    recipeData.totalTime = Number(recipeData.prepTime) + Number(recipeData.cookTime);

    const result = await RecipeService.createRecipeIntoDB(recipeData);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Recipe created successfully",
        data: result,
    })
});


// update recipe for 
const updateRecipe = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const recipeData = req.body;
    if (recipeData.prepTime || recipeData.cookTime) {
        recipeData.totalTime = Number(recipeData.prepTime) + Number(recipeData.cookTime);
    }
    const updatedRecipe = await RecipeService.updateRecipeIntoDB(id, recipeData, req?.files as Express.Multer.File[]);

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
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
    };

    const searchTerm = req.query.searchTerm as string; // Accept search input

    const result = await RecipeService.getAllRecipes(paginationOptions, searchTerm);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        Total: result.data.length,
        success: true,
        message: 'All Recipes retrieved successfully',
        data: result,
    });
});


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