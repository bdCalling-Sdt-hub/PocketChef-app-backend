import { Request, Response, NextFunction } from 'express';
import { DashboardServices } from './dashboard.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';


const totalUser = catchAsync(async (req: Request, res: Response) => {
    const result = await DashboardServices.totalUserFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Total User fetched successfully',
        data: result
    })
})



const totalNewUser = catchAsync(async (req: Request, res: Response) => {
    const result = await DashboardServices.totalNewUserFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Total New User fetched successfully',
        data: result
    })
})


const totalRecipe = catchAsync(async (req: Request, res: Response) => {
    const result = await DashboardServices.totalRecipeFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Total Recipe fetched successfully',
        data: result
    })
})


const totalRecommendationRecipe = catchAsync(async (req: Request, res: Response) => {
    const result = await DashboardServices.totalRecommendationRecipeFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Total Recommendation Recipe fetched successfully',
        data: result
    })
})


const RecentViewRecipe = catchAsync(async (req: Request, res: Response) => {
    const result = await DashboardServices.RecentViewRecipeFromDB();
    sendResponse(res, {
        success: true,
        Total: result.Total,
        statusCode: 200,
        message: 'Recent View Recipe fetched successfully',
        data: result
    })
})


const totalData = catchAsync(async (req: Request, res: Response) => {
    const result = await DashboardServices.totalData();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Total Data fetched successfully',
        data: result
    })
})
export const DashboardController = {
    totalUser,
    totalNewUser,
    totalRecipe,
    totalRecommendationRecipe,
    RecentViewRecipe,
    totalData
};
