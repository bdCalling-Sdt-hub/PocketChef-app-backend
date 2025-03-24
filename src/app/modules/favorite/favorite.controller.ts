import { Request, Response, NextFunction } from 'express';
import { FavoriteServices } from './favorite.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiErrors';
import { Favorite } from './favorite.model';


const createFavorite = catchAsync(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = (req.user as JwtPayload)?.id;

    const favoriteData = {
        ...req.body,
        userId
    };
    const result = await FavoriteServices.createFavoriteIntoDB(favoriteData)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Favorite created successfully',
        data: result
    })
})

const getAllFavorite = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload)?.id;
    const result = await FavoriteServices.getAllFavoriteIntoDB(userId)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Favorite fetched successfully',
        data: result
    })
})

const getSingleFavorite = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await FavoriteServices.getSingleFavoriteIntoDB(id)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Favorite fetched successfully',
        data: result
    })
})

const updateFavorite = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const favorite = req.body
    const result = await FavoriteServices.updateFavoriteIntoDB(id, favorite)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Favorite updated successfully',
        data: result
    })
})

const deleteFavorite = catchAsync(async (req: Request, res: Response) => {
    const { _id } = req.params
    const result = await FavoriteServices.deleteFavoriteIntoDB(_id)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Favorite deleted successfully',
        data: result
    })
})


const getRecentFavorite = catchAsync(async (req: Request, res: Response) => {
    // No need to pass an ID in the query for recent favorites
    const recentFavorites = await FavoriteServices.getRecentFavoriteFromDB();

    // Format the response if needed
    const formattedFavorites = recentFavorites.map(fav => {
        return {
            _id: fav._id,
            recipeId: fav.recipeId,
            userId: fav.userId,
            folderName: fav.folderName,
            // @ts-ignore
            createdAt: fav.createdAt,
            // @ts-ignore
            updatedAt: fav.updatedAt,
        };
    });

    // Send the response
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Recent favorites fetched successfully',
        data: formattedFavorites,
    });
});












export const FavoriteController = { createFavorite, getAllFavorite, getSingleFavorite, updateFavorite, deleteFavorite, getRecentFavorite };
