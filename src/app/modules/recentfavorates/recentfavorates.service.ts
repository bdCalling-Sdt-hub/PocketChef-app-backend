
import { IRecentfavorates } from './recentfavorates.interface';
import { Recentfavorates } from './recentfavorates.model';
import ApiError from '../../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';



const createRecentfavoratesIntoDB = async (payload: IRecentfavorates) => {
    // Check if the recent favorite already exists in the database
    const existingFavorite = await Recentfavorates.findOne({
        recipeId: payload.recipeId,
        userId: payload.userId,  // Ensure this matches the user and recipe combination
    });

    // If the favorite exists, remove it (unlike)
    if (existingFavorite) {
        await Recentfavorates.deleteOne({
            recipeId: payload.recipeId,
            userId: payload.userId,  // Ensure it is the correct record to remove
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



export const RecentfavoratesServices = {
    createRecentfavoratesIntoDB
};
