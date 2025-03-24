import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { IFavorite } from './favorite.interface';
import { Favorite } from './favorite.model';

const createFavoriteIntoDB = async (payload: IFavorite) => {
    const favorite = await Favorite.create(payload)
    if (!favorite) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Favorite')
    }
    return favorite
}

const getAllFavoriteIntoDB = async (userId: string) => {
    const favorite = await Favorite.find({ userId }).populate('recipeId');
    if (!favorite) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Favorite not found')
    }
    return favorite
}




const getSingleFavoriteIntoDB = async (id: string) => {
    const favorite = await Favorite.findById(id).populate('recipeId');
    if (!favorite) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Favorite not found')
    }
    return favorite
}

const updateFavoriteIntoDB = async (id: string, payload: IFavorite) => {
    const { recipeId } = payload;

    let existingFavorite = await Favorite.findById(id);

    if (!existingFavorite) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Favorite not found');
    }

    existingFavorite.recipeId = [...new Set([...existingFavorite.recipeId, ...recipeId])];

    await existingFavorite.save();
    return existingFavorite;
};


const deleteFavoriteIntoDB = async (id: string) => {
    const favorite = await Favorite.findByIdAndDelete(id)
    if (!favorite) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Favorite not found')
    }
    return favorite
}
// recent favorite
const getRecentFavoriteFromDB = async () => {
    try {
        console.log('Fetching recent favorites from the DB...');
        const favorites = await Favorite.find()
            .sort({ createdAt: -1 }) // Sort by createdAt for most recent
            .limit(6); // Limit to 6 most recent entries

        console.log('Fetched recent favorites:', favorites);

        return favorites;
    } catch (error) {
        console.error('Error fetching recent favorites:', error);
        throw new Error('Failed to fetch recent favorites');
    }
};








export const FavoriteServices = {
    createFavoriteIntoDB,
    getAllFavoriteIntoDB,
    getSingleFavoriteIntoDB,
    updateFavoriteIntoDB,
    deleteFavoriteIntoDB,
    getRecentFavoriteFromDB
};