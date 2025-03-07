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
    const images = files && 'image' in files ? getFilePaths(files['image'] as Express.Multer.File[]) : existingRecipe.image;

    // Handle video (if present), retain the old video if no new one is uploaded
    const video = files && 'video' in files ? (files['video'] as Express.Multer.File[])[0].path : payload.video || existingRecipe.video;

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

// const getAllRecipes = async (paginationOptions: IPaginationOptions) => {
//     const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(paginationOptions);

//     const recipes = await Recipe.aggregate([
//         {
//             // start matching with recipe collection
//             $lookup: {
//                 from: "ratings",
//                 localField: "_id", // Recipe _id
//                 foreignField: "recipeId", // Rating recipeId
//                 as: "ratings"
//             }
//         },
//         {
//             // Lookup category for each recipe
//             $lookup: {
//                 from: "categories", // Category collection name
//                 localField: "category", // Field in Recipe schema
//                 foreignField: "_id", // _id in Category schema
//                 as: "category"
//             }
//         },
//         {
//             $lookup: {
//                 from: "subcategories",
//                 localField: "subCategory",
//                 foreignField: "_id",
//                 as: "subcategory"
//             }
//         },
//         {
//             $addFields: {
//                 averageRating: {
//                     $cond: {
//                         if: { $gt: [{ $size: "$ratings" }, 0] },
//                         then: {
//                             $avg: "$ratings.star" // Average of the 'star' field in ratings
//                         },
//                         else: 0
//                     }
//                 },
//                 totalRatings: { $size: "$ratings" } // Count total ratings
//             }
//         },
//         {
//             $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 }
//         },
//         {
//             $skip: skip
//         },
//         {
//             $limit: limit
//         }
//     ]);


//     const total = await Recipe.countDocuments().populate("category");
//     if (!recipes.length) throw new ApiError(StatusCodes.NOT_FOUND, 'Recipes not found');

//     return {
//         meta: {
//             page,
//             limit,
//             total
//         },
//         data: recipes
//     };
// };

const getAllRecipes = async (paginationOptions: IPaginationOptions, searchTerm?: string) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(paginationOptions);

    // Define the match filter
    const matchFilter: any = {};

    if (searchTerm) {
        matchFilter.$or = [
            { recipeName: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search for recipe name
            { tags: { $regex: searchTerm, $options: "i" } }, // Search in tags
            { keyIngredients: { $regex: searchTerm, $options: "i" } } // Search in key ingredients
        ];
    }

    const recipes = await Recipe.aggregate([
        { $match: matchFilter }, // Apply search filter
        {
            $lookup: {
                from: "subcategories",
                localField: "subCategory",
                foreignField: "_id",
                as: "subcategory"
            }
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
        {
            $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 }
        },
        { $skip: skip },
        { $limit: limit }
    ]);

    const total = await Recipe.countDocuments(matchFilter); // Count based on the search filter

    if (!recipes.length) throw new ApiError(StatusCodes.NOT_FOUND, 'Recipes not found');

    return {
        meta: { page, limit, total },
        data: recipes
    };
};





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