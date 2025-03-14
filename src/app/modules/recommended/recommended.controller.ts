import { Request, Response, NextFunction } from 'express';
import { RecommendedServices } from './recommended.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';


const getTopRatedRecipes = catchAsync(async (req: Request, res: Response) => {
    const result = await RecommendedServices.getTopRatedRecipes();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Top Rated Recipes retrieved successfully',
        data: result,
    });
});
export const RecommendedController = {
    getTopRatedRecipes
};
