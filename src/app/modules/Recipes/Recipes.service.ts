import { StatusCodes } from "http-status-codes"
import ApiError from "../../../errors/ApiErrors"
import { IRecipes } from "./Recipes.interface"
import { RecentlyViewed, Recipe } from "./Recipes.model"
import { paginationHelper } from "../../../helpers/paginationHelper"
import mongoose from "mongoose"
import { IPaginationOptions } from "../../../types/pagination"

const createRecipeIntoDB = async (payload: IRecipes) => {

    const recipes = await Recipe.create(payload)
    if (!recipes) throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create recipe')

    return recipes
}

const updateRecipeIntoDB = async (id: string, payload: IRecipes, files?: any) => {
    const existingRecipe = await Recipe.findById(id);
    if (!existingRecipe) throw new Error("Recipe not found");

    const images = files?.image ? files.image.map((file: any) => file.path) : existingRecipe.image;
    const video = files?.video ? files.video[0].path : existingRecipe.video;

    const updatedPayload = {
        ...payload,
        image: images,
        video: video,
        totalTime: Number(payload.prepTime) + Number(payload.cookTime),
    };

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updatedPayload, { new: true });
    return updatedRecipe;
};


// get all recipes

const getAllRecipes = async (paginationOptions: IPaginationOptions, searchTerm?: string) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(paginationOptions);

    // Ensure searchTerm is always a string
    searchTerm = searchTerm ? String(searchTerm).trim() : "";

    const matchFilter: any = {};

    if (searchTerm) {
        matchFilter.$or = [
            { recipeName: { $regex: searchTerm, $options: "i" } },
            { tags: { $in: [searchTerm] } },
            { keyIngredients: { $in: [searchTerm] } },
            { "subcategory.subCategory": { $regex: searchTerm, $options: "i" } }
        ];
    }

    const recipes = await Recipe.aggregate([
        {
            $lookup: {
                from: "subcategories",
                localField: "subCategory",
                foreignField: "_id",
                as: "subcategory"
            }
        },
        {
            $match: matchFilter
        },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $lookup: {
                from: "ratings",
                localField: "_id",
                foreignField: "recipeId",
                as: "ratings"
            }
        },
        {
            $lookup: {
                from: "instructions",
                localField: "instructions",
                foreignField: "_id",
                as: "instructions"
            }
        },
        {
            $addFields: {
                averageRating: {
                    $cond: {
                        if: { $gt: [{ $size: "$ratings" }, 0] },
                        then: { $avg: "$ratings.star" },
                        else: 0
                    }
                },
                totalRatings: { $size: "$ratings" }
            }
        },
        { $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 } },
        { $skip: skip },
        { $limit: limit }
    ]);


    if (!recipes.length) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Recipes not found");
    }

    return {
        meta: { page, limit, total: recipes.length },
        data: recipes
    };
};

// const getSingleRecipe = async (id: string, userId: string) => {

//     if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
//         throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Recipe ID or User ID");
//     }

//     const recipe = await Recipe.aggregate([
//         { $match: { _id: new mongoose.Types.ObjectId(id) } },
//         {
//             $lookup: {
//                 from: "ratings",
//                 localField: "ratings",
//                 foreignField: "_id",
//                 as: "ratingsData"
//             }
//         },
//         {
//             $addFields: {
//                 averageRating: {
//                     $cond: {
//                         if: { $gt: [{ $size: "$ratingsData" }, 0] },
//                         then: { $avg: "$ratingsData.star" },
//                         else: 0
//                     }
//                 },
//                 totalRatings: { $size: "$ratingsData" }
//             }
//         }
//     ]);

//     if (!recipe.length) {
//         throw new ApiError(StatusCodes.NOT_FOUND, "Recipe not found");
//     }

//     try {
//         await RecentlyViewed.findOneAndUpdate(
//             { userId: new mongoose.Types.ObjectId(userId), recipeId: new mongoose.Types.ObjectId(id) },
//             { $set: { createdAt: new Date() } },
//             { upsert: true, new: true }
//         );
//     } catch (error) {
//         throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error logging Recently Viewed");
//     }
//     return recipe[0];
// };




// delete recipe


const getSingleRecipe = async (id: string, userId: string) => {
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Recipe ID or User ID");
    }

    const recipe = await Recipe.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },

        // Lookup for ingredientName
        {
            $lookup: {
                from: "ingredients",
                localField: "ingredientName",
                foreignField: "_id",
                as: "ingredientData"
            }
        },

        // Lookup for instructions
        {
            $lookup: {
                from: "instructions",
                localField: "instructions",
                foreignField: "_id",
                as: "instructionsData"
            }
        },

        // Lookup for ratings
        {
            $lookup: {
                from: "ratings",
                localField: "ratings",
                foreignField: "_id",
                as: "ratingsData"
            }
        },

        // Add fields for ratings (average, total)
        {
            $addFields: {
                averageRating: {
                    $cond: {
                        if: { $gt: [{ $size: "$ratingsData" }, 0] },
                        then: { $avg: "$ratingsData.star" },
                        else: 0
                    }
                },
                totalRatings: { $size: "$ratingsData" }
            }
        },

        // Optionally remove raw ratings data if it's not needed in the response
        {
            $project: {
                ratingsData: 0
            }
        }
    ]);

    if (!recipe.length) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Recipe not found");
    }

    try {
        await RecentlyViewed.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId), recipeId: new mongoose.Types.ObjectId(id) },
            { $set: { createdAt: new Date() } },
            { upsert: true, new: true }
        );
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error logging Recently Viewed");
    }

    return recipe[0];
};






const deleteRecipeFromDB = async (id: string) => {
    const recipe = await Recipe.findByIdAndDelete(id);
    if (!recipe) throw new ApiError(StatusCodes.NOT_FOUND, 'Recipe not found');
    return recipe;
}



// get recently viewed
const getRecentlyViewed = async (userId: string) => {

    // Validate the userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid User ID");
    }

    const recentlyViewed = await RecentlyViewed.aggregate([
        {
            $match: { userId: new mongoose.Types.ObjectId(userId) }  // Match by userId
        },
        {
            $lookup: {
                from: 'recipes',  // Join with recipes collection
                localField: 'recipeId',  // Match 'recipeId' in RecentlyViewed
                foreignField: '_id',  // Match with '_id' in recipes collection
                as: 'recipeData'  // Alias for recipe data
            }
        },
        {
            $unwind: '$recipeData'  // Unwind the 'recipeData' array to flatten the structure
        },
        {
            $lookup: {
                from: 'ratings',  // Join with ratings collection
                localField: 'recipeId',  // Match 'recipeId' in RecentlyViewed
                foreignField: 'recipeId',  // Match with 'recipeId' in ratings collection
                as: 'ratingsData'  // Alias for ratings data
            }
        },
        {
            $addFields: {
                // Calculate the average rating if there are ratings
                averageRating: {
                    $cond: {
                        if: { $gt: [{ $size: "$ratingsData" }, 0] }, // Check if ratings exist
                        then: { $avg: "$ratingsData.rating" },  // If there are ratings, calculate average
                        else: null  // If no ratings, set it to null
                    }
                },
                // Count the total number of ratings
                totalRatings: { $size: "$ratingsData" }
            }
        },
        {
            $project: {
                recipeData: 1,  // Include all fields from 'recipeData'
                createdAt: 1,  // Include 'createdAt' field from RecentlyViewed
                ratingsData: 1,  // Include all fields from 'ratingsData'
                averageRating: 1,  // Include the calculated 'averageRating'
                totalRatings: 1  // Include the total number of ratings
            }
        },
        {
            $sort: { createdAt: -1 }  // Sort by the most recently viewed first
        }
    ]);

    // Return the aggregated recently viewed data
    return recentlyViewed;
};





export const RecipeService = {
    createRecipeIntoDB,
    updateRecipeIntoDB,
    getAllRecipes,
    getSingleRecipe,
    deleteRecipeFromDB,
    getRecentlyViewed
}