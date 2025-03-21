import { Request, Response, NextFunction } from 'express';
import { RecentfavoratesServices } from './recentfavorates.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';


const createRecentFavorites = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const userId = req.user?.id;

    // Ensure userId exists
    if (!userId) {
        return sendResponse(res, {
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'User not authenticated',
        });
    }

    const { recipeId } = req.body;

    // Prepare the payload with the userId and recipeId
    const recentfavoratesData = {
        userId,
        recipeId,
    };

    // Call the service function to toggle favorite
    const result = await RecentfavoratesServices.createRecentFevoratesIntoDB(recentfavoratesData);

    // Send the response back to the client
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: result.message,
        data: result.data || null,
    });
});


const getAllRecentFavorites = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await RecentfavoratesServices.getAllRecentFavortesIntoDB();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Recent favorites fetched successfully',
        data: result,
    });
});



export const RecentfavoratesController = {
    createRecentFavorites,
    getAllRecentFavorites
};
