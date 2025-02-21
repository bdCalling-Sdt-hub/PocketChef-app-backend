import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { FavoriteModel, IFavorite } from './favorite.interface';
import { Favorite } from './favorite.model';


const createFavoriteIntoDB = async (payload: IFavorite) => {
    const favorite = await Favorite.create(payload)
    if (!favorite) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Favorite');
    }
    return favorite;

}


export const FavoriteServices = {
    createFavoriteIntoDB
};
