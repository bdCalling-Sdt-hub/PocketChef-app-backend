import { StatusCodes } from "http-status-codes"
import ApiError from "../../../errors/ApiErrors"
import { IRecipes } from "./Recipes.interface"
import { Recipe } from "./Recipes.model"
import { IPaginationOptions, paginationHelper } from "../../../helpers/paginationHelper"

const createRecipeIntoDB = async (payload: IRecipes) => {

    const recipes = await Recipe.create(payload)
    if (!recipes) throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create recipe')

    return recipes
}

const updateRecipeIntoDB = async (id: string, payload: IRecipes, files?: Express.Multer.File[]) => {
    // Fetch the existing recipe from the database to preserve missing fields (e.g., images or video)
    const existingRecipe = await Recipe.findById(id);
    if (!existingRecipe) throw new ApiError(StatusCodes.NOT_FOUND, 'Recipe not found');

    // Handle image files (if any)
    const getFilePaths = (files: Express.Multer.File[] | undefined): string[] => {
        return files ? files.map((file) => file.path) : [];
    };

    // If no new images are uploaded, retain the old images
    const images = files?.["image"] ? getFilePaths(files["image"] as Express.Multer.File[]) : existingRecipe.image;

    // Handle video (if present), retain the old video if no new one is uploaded
    const video = files?.["video"] ? files["video"][0].path : payload.video || existingRecipe.video;

    // Calculate total time
    const prepTime = payload.prepTime ? Number(payload.prepTime) : existingRecipe.prepTime;
    const cookTime = payload.cookTime ? Number(payload.cookTime) : existingRecipe.cookTime;
    // Prepare the updated payload
    const updatedPayload = {
        ...payload,
        prepTime,
        cookTime,
        image: images,
        video,
    };

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updatedPayload, { new: true });
    if (!updatedRecipe) throw new ApiError(StatusCodes.NOT_FOUND, 'Recipe not found');
    return updatedRecipe;
};



// get all recipes

const getAllRecipes = async (paginationOptions: IPaginationOptions) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(paginationOptions)
    const recipes = await Recipe.aggregate([
        {

            // start connection with rating collection
            $lookup: {
                // where it take from
                from: "ratings",
                // local Field means which field is match
                localField: "_id",
                // foreign Field means which field is match
                foreignField: "recipeId",
                // as means where it store
                as: "ratings"
            }
        },
        {
            $addFields: {
                averageRating: {
                    $cond: {
                        if: { $gt: [{ $size: "$ratings" }, 0] }, // Check if ratings exist
                        then: { $avg: "$ratings.star" }, // Calculate the average
                        else: 0
                    }
                },
                totalRatings: { $size: { $ifNull: ["$ratings", []] } } // Ensure array exists before counting
            }
        },
        {
            $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ])
    const total = await Recipe.countDocuments()
    if (!recipes.length) throw new ApiError(StatusCodes.NOT_FOUND, 'Recipes not found');
    return {
        meta: {
            page,
            limit,
            total
        },
        data: recipes
    }
}

const getSingleRecipe = async (id: string) => {
    const recipe = await Recipe.findById(id);
    if (!recipe) throw new ApiError(StatusCodes.NOT_FOUND, 'Recipe not found');
    return recipe;
}

// delete recipe

const deleteRecipeFromDB = async (id: string) => {
    const recipe = await Recipe.findByIdAndDelete(id);
    if (!recipe) throw new ApiError(StatusCodes.NOT_FOUND, 'Recipe not found');
    return recipe;
}



export const RecipeService = {
    createRecipeIntoDB,
    updateRecipeIntoDB,
    getAllRecipes,
    getSingleRecipe,
    deleteRecipeFromDB,

}