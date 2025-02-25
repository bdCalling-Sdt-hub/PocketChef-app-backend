import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { rating } from './rating.model';


const createRatingIntoDB = async (payload: { userId: string; star: number; comment: string, recipeId: string }) => {
    const result = await rating.create(payload)
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create rating')
    }
    return result
}


export const ratingServices = {
    createRatingIntoDB
};
