import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { RecipeService } from "./Recipes.service";
import ApiError from "../../../errors/ApiErrors";
import { RecentlyViewed, Recipe } from "./Recipes.model";
import mongoose, { isValidObjectId } from "mongoose";




const createRecipe = catchAsync(async (req: Request, res: Response) => {
    const recipeData = req.body;


    // Parse JSON strings into actual arrays if needed
    const parseJsonArray = (field: any) => {
        if (typeof field === 'string') {
            try {
                return JSON.parse(field);
            } catch (e) {
                return [];
            }
        }
        return field;
    };

    // Parsing stringified arrays into arrays

    recipeData.tags = parseJsonArray(recipeData.tags);
    recipeData.NutritionalValue = parseJsonArray(recipeData.NutritionalValue);
    recipeData.ingredientName = parseJsonArray(recipeData.ingredientName);

    recipeData.ingredientName = recipeData.ingredientName.map((ingredient: any) => {
        try {
            return {
                ingredientName: new mongoose.Types.ObjectId(ingredient.ingredientName),
                amount: ingredient.amount,
                unit: ingredient.unit
            };
        } catch (e) {
            return null;
        }
    }).filter(Boolean);

    recipeData.totalTime = Number(recipeData.prepTime) + Number(recipeData.cookTime);



    // Now, call the service to save the recipe
    const result = await RecipeService.createRecipeIntoDB(recipeData);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Recipe created successfully",
        data: result,
    });
});





// update recipe for 
const updateRecipe = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const recipeData = req.body;
    const updatedRecipe = await RecipeService.updateRecipeIntoDB(id, recipeData, req.files);

    res.status(200).json({
        success: true,
        message: "Recipe updated successfully",
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

    const searchTerm = req.query.searchTerm as string;

    const result = await RecipeService.getAllRecipes(paginationOptions, searchTerm);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        Total: result.data.length,
        success: true,
        message: 'All Recipes retrieved successfully',
        data: result.data,
    });
});


// single recipe
const getSingleRecipe = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    // Extract `userId` from JWT token (set by auth middleware)
    const userId = (req as any).user?.id;


    // Validate Recipe ID and User ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, `Invalid Recipe ID: ${id}`);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, `Invalid User ID: ${userId}`);
    }

    // Fetch the single recipe using the service
    const result = await RecipeService.getSingleRecipe(id, userId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Single Recipe retrieved successfully",
        data: result,
    });
});


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


const getRecentlyViewed = catchAsync(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId: any = req.user?.id;

    // Check if userId exists
    if (!userId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is missing');
    }

    // Fetch the recently viewed recipes for the user
    const recentlyViewed = await RecipeService.getRecentlyViewed(userId);

    if (!recentlyViewed || !recentlyViewed.length) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'No recently viewed recipes found');
    }

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Recently viewed recipes fetched successfully',
        data: recentlyViewed,
    });
});










export const RecipeController = {
    createRecipe,
    updateRecipe,
    getAllRecipe,
    getSingleRecipe,
    deleteRecipe,
    getRecentlyViewed
}