import { Request, Response, NextFunction } from 'express';
import { FavoriteServices } from './favorite.service';
import catchAsync from '../../../shared/catchAsync';
import ApiError from '../../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';

const createFavoriteService = catchAsync(async (req: Request, res: Response) => {
    const favorite = req.body
    const result = await FavoriteServices.createFavoriteIntoDB(favorite);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Favorite')
    }
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Favorite created successfully',
        data: result
    })
})

export const FavoriteController = {
    createFavoriteService
};
