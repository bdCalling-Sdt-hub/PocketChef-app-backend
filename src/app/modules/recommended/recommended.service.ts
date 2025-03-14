import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { Recipe } from '../Recipes/Recipes.model';


const getTopRatedRecipes = async () => {
    try {
        const topRatedRecipes = await Recipe.aggregate([
            // Perform a lookup to join the "ratings" collection with the "Recipe" collection
            {
                $lookup: {
                    from: "ratings",
                    localField: "_id",
                    foreignField: "recipeId",
                    as: "ratingsData"
                }
            },
            // Add a new field to calculate the average rating for each recipe
            {
                $addFields: {
                    averageRating: {
                        $cond: {
                            if: { $gt: [{ $size: "$ratingsData" }, 0] },
                            then: { $avg: "$ratingsData.star" },
                            else: 0
                        }
                    }
                }
            },
            // Sort recipes by average rating in descending order
            { $sort: { averageRating: -1 } },
            // Limit to 4 recipes only
            { $limit: 4 },

            {
                $project: {
                    ratingsData: 0
                }
            }
        ]);

        return topRatedRecipes;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error fetching top rated recipes");
    }
};

export const RecommendedServices = {
    getTopRatedRecipes
};
