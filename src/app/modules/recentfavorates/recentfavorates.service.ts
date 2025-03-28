
import { IRecentfavorates } from './recentfavorates.interface';
import { Recentfavorates } from './recentfavorates.model';
import ApiError from '../../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';



const createRecentFevoratesIntoDB = async (payload: IRecentfavorates) => {
    // Check if the recent favorite already exists in the database
    const existingFavorite = await Recentfavorates.findOne({
        recipeId: payload.recipeId,
        userId: payload.userId,
    });

    // If the favorite exists, remove it (unlike)
    if (existingFavorite) {
        await Recentfavorates.deleteOne({
            recipeId: payload.recipeId,
            userId: payload.userId,
        });

        return { message: 'Removed from favorites', success: true };
    }

    // If the favorite does not exist, create a new favorite (like)
    const newFavorite = await Recentfavorates.create(payload);

    if (!newFavorite) {
        throw new Error('Failed to add to favorites');
    }

    return { message: 'Added to favorites', success: true, data: newFavorite };
};


// get all
const getAllRecentFavortesIntoDB = async () => {
    const result = await Recentfavorates.find({}).populate('recipeId');
    if (!result) {
        return []
    }
    return result
}



export const RecentfavoratesServices = {
    createRecentFevoratesIntoDB,
    getAllRecentFavortesIntoDB
};
