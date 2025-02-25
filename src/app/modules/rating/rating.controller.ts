import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../../shared/catchAsync';
import ApiError from '../../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import { ratingServices } from './rating.service';

const createRating = catchAsync(async (req: Request, res: Response) => {

    if (!req?.user || !req?.user?.id) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
    }

    const { star, comment, recipeId } = req.body;
    const ratingData = { userId: req.user?.id, star, comment, recipeId };

    const rating = await ratingServices.createRatingIntoDB(ratingData);
    if (!rating) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create Rating");
    }

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Rating created successfully",
        data: rating,
    });
})


export const ratingController = {
    createRating
};
