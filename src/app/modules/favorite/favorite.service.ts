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
    const favorite = await Favorite.find({ userId })
    if (!favorite) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Favorite not found')
    }
    return favorite
}

const getSingleFavoriteIntoDB = async (id: string) => {
    const favorite = await Favorite.findById(id)
    if (!favorite) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Favorite not found')
    }
    return favorite
}

const updateFavoriteIntoDB = async (id: string, payload: IFavorite) => {
    const favorite = await Favorite.findByIdAndUpdate(id, payload, { new: true })
    if (!favorite) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Favorite not found')
    }
    return favorite
}

const deleteFavoriteIntoDB = async (id: string) => {
    const favorite = await Favorite.findByIdAndDelete(id)
    if (!favorite) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Favorite not found')
    }
    return favorite
}
export const FavoriteServices = {
    createFavoriteIntoDB,
    getAllFavoriteIntoDB,
    getSingleFavoriteIntoDB,
    updateFavoriteIntoDB,
    deleteFavoriteIntoDB
};